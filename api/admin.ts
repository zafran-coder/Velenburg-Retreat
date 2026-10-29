import { getSupabaseAdmin, verifyAdminAuth } from './_lib/supabaseClient';

async function parseJsonBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  if (req.body && typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: Buffer | string) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const body = req.method === 'POST' ? await parseJsonBody(req) : {};
  const authHeader = req.headers['x-admin-password'] || req.headers['authorization'];
  const providedPassword =
    (Array.isArray(authHeader) ? authHeader[0] : authHeader) || body?.password || body?.adminPassword;

  const url = new URL(req.url || '', 'http://localhost');
  const action = url.searchParams.get('action') || body?.action;

  // --------------------------------------------------------------------------
  // Action: Verify Admin Passcode (POST /api/admin?action=verify)
  // --------------------------------------------------------------------------
  if (action === 'verify' || body?.action === 'verify') {
    const isCorrect = verifyAdminAuth(providedPassword);
    if (!isCorrect) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Incorrect admin passcode.' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Admin authenticated successfully.' }));
    return;
  }

  // All subsequent actions require verified admin authentication!
  if (!verifyAdminAuth(providedPassword)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized: Admin authentication required.' }));
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Supabase database is not configured. Check .env.local.' }));
    return;
  }

  // --------------------------------------------------------------------------
  // Action: Get All Rooms & iCal Configs (GET /api/admin?action=rooms)
  // --------------------------------------------------------------------------
  if (req.method === 'GET' || action === 'rooms') {
    try {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ rooms: rooms || [] }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err?.message || 'Server error' }));
    }
    return;
  }

  // --------------------------------------------------------------------------
  // Action: Update Room iCal URLs (POST /api/admin with action: 'update_ical_urls')
  // --------------------------------------------------------------------------
  if (action === 'update_ical_urls') {
    try {
      const { roomId, airbnbIcalUrl, bookingComIcalUrl } = body;
      if (!roomId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'roomId is required.' }));
        return;
      }

      const { data, error } = await supabase
        .from('rooms')
        .upsert(
          {
            id: Number(roomId),
            name: `Room ${roomId} — Luxury Suite 0${roomId}`,
            slug: `room-${roomId}`,
            price_per_night_pkr: 18000,
            airbnb_ical_url: airbnbIcalUrl ? airbnbIcalUrl.trim() : null,
            booking_com_ical_url: bookingComIcalUrl ? bookingComIcalUrl.trim() : null,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, room: data }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err?.message || 'Failed to update room iCal URLs' }));
    }
    return;
  }

  // --------------------------------------------------------------------------
  // Action: Update Booking Status (POST /api/admin with action: 'update_status')
  // --------------------------------------------------------------------------
  if (action === 'update_status') {
    try {
      const { bookingId, status } = body;
      if (!bookingId || !status) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'bookingId and status are required.' }));
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, booking: data }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err?.message || 'Failed to update booking status' }));
    }
    return;
  }

  res.statusCode = 400;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Unknown admin action.' }));
}

