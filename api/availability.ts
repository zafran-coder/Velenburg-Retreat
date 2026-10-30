import ical from 'node-ical';
import { getSupabaseAdmin, verifyAdminAuth } from './_lib/supabaseClient';
import { isSafeIcalUrl } from './_lib/security';

export interface BlockedRangeItem {
  id: string;
  roomId: number;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  source: 'airbnb' | 'booking_com' | 'website' | 'manual_block';
  guestName?: string;
  notes?: string;
}

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || '*';

  // Security headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const url = new URL(req.url || '', 'http://localhost');
    const roomIdParam = url.searchParams.get('roomId') || (req.query && req.query.roomId);
    const targetRoomId = roomIdParam ? Number(roomIdParam) : null;

    const authHeader = req.headers['authorization'] || req.headers['x-admin-password'];
    const isAdmin = verifyAdminAuth(Array.isArray(authHeader) ? authHeader[0] : authHeader);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          roomId: targetRoomId,
          pricePerNightPkr: 18000,
          blockedRanges: [],
          warning: 'Supabase credentials not configured yet in .env.local.',
        })
      );
      return;
    }

    // 1. Fetch Rooms to get iCal URLs
    let roomsQuery = supabase.from('rooms').select('id, name, airbnb_ical_url, booking_com_ical_url');
    if (targetRoomId) {
      roomsQuery = roomsQuery.eq('id', targetRoomId);
    }
    const { data: rooms, error: roomsError } = await roomsQuery;

    if (roomsError) {
      console.error('[API Availability] Error fetching rooms:', roomsError.message);
    }

    // 2. Fetch Active Bookings & Manual Blocks from Database
    let bookingsQuery = supabase
      .from('bookings')
      .select('id, room_id, guest_name, check_in, check_out, status, source, notes')
      .or('status.eq.confirmed,source.eq.manual_block');

    if (targetRoomId) {
      bookingsQuery = bookingsQuery.eq('room_id', targetRoomId);
    }

    const { data: bookings, error: bookingsError } = await bookingsQuery;
    if (bookingsError) {
      console.error('[API Availability] Error fetching bookings:', bookingsError.message);
    }

    // Strict Data Privacy: Anonymize guest names & strip private notes for public visitors
    const blockedRanges: BlockedRangeItem[] = (bookings || []).map((b) => ({
      id: b.id,
      roomId: b.room_id,
      start: typeof b.check_in === 'string' ? b.check_in.split('T')[0] : b.check_in,
      end: typeof b.check_out === 'string' ? b.check_out.split('T')[0] : b.check_out,
      source: (b.source as BlockedRangeItem['source']) || 'website',
      guestName: isAdmin ? b.guest_name : b.source === 'manual_block' ? 'Owner Reserved' : 'Reserved',
      notes: isAdmin ? b.notes || undefined : undefined,
    }));

    // 3. Sync live iCal calendars from Airbnb & Booking.com for each room
    const targetRooms = rooms && rooms.length > 0 ? rooms : targetRoomId ? [{ id: targetRoomId }] : [];

    for (const room of targetRooms as any[]) {
      const feeds: { url?: string; source: 'airbnb' | 'booking_com' }[] = [
        { url: room.airbnb_ical_url, source: 'airbnb' },
        { url: room.booking_com_ical_url, source: 'booking_com' },
      ].filter((f) => Boolean(f.url && f.url.trim().startsWith('http')));

      for (const feed of feeds) {
        // SSRF Safety Check before network request
        if (!isSafeIcalUrl(feed.url!).safe) {
          console.warn(`[SSRF Blocked] Insecure iCal feed rejected for room ${room.id} (${feed.source})`);
          continue;
        }

        try {
          const events = await ical.async.fromURL(feed.url!);
          for (const key in events) {
            const ev = events[key];
            if (ev && ev.type === 'VEVENT' && ev.start && ev.end) {
              const startDate = new Date(ev.start);
              const endDate = new Date(ev.end);
              if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                blockedRanges.push({
                  id: `ical-${feed.source}-${room.id}-${key}`,
                  roomId: room.id,
                  start: startDate.toISOString().split('T')[0],
                  end: endDate.toISOString().split('T')[0],
                  source: feed.source,
                  guestName: `${feed.source === 'airbnb' ? 'Airbnb' : 'Booking.com'} Reservation`,
                  notes: isAdmin ? `Live synced via ${feed.source} iCal feed` : undefined,
                });
              }
            }
          }
        } catch (err: any) {
          console.warn(`[iCal Sync Warning] Room ${room.id} (${feed.source}): ${err?.message}`);
        }
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        roomId: targetRoomId,
        pricePerNightPkr: 18000,
        blockedRanges,
      })
    );
  } catch (error: any) {
    console.warn('[API Availability]: Supabase is paused or unreachable. Signaling client fallback:', error?.message);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        databasePaused: true,
        fallback: true,
        roomId: targetRoomId,
        pricePerNightPkr: 18000,
        blockedRanges: [],
        message: 'Supabase project is paused or sleeping. Local fallback active.',
      })
    );
  }
}
