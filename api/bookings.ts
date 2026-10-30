import { getSupabaseAdmin, verifyAdminAuth } from './_lib/supabaseClient';
import { sanitizeText, isValidDateStr } from './_lib/security';

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
  const origin = req.headers.origin || '*';

  // Secure headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Supabase database is not configured. Check .env.local.' }));
    return;
  }

  const authHeader = req.headers['authorization'] || req.headers['x-admin-password'];
  const isAdmin = verifyAdminAuth(Array.isArray(authHeader) ? authHeader[0] : authHeader);

  // --------------------------------------------------------------------------
  // GET: List Bookings (Strict Data Privacy Filtering)
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url || '', 'http://localhost');
      const roomId = url.searchParams.get('roomId');
      const numRoomId = roomId ? Number(roomId) : null;

      // Strict Data Privacy: Non-admins NEVER receive guest phone numbers, full names, or notes
      let query = isAdmin
        ? supabase.from('bookings').select('*')
        : supabase
            .from('bookings')
            .select('id, room_id, check_in, check_out, source, status')
            .or('status.eq.confirmed,source.eq.manual_block');

      if (numRoomId && numRoomId >= 1 && numRoomId <= 4) {
        query = query.eq('room_id', numRoomId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ bookings: data || [] }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err?.message || 'Server error' }));
    }
    return;
  }

  // --------------------------------------------------------------------------
  // POST: Create Booking Inquiry or Admin Manual Block
  // --------------------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const {
        booking_ref,
        room_id,
        guest_name,
        guest_phone,
        guests_count = 2,
        check_in,
        check_out,
        nights,
        total_price_pkr,
        status = 'pending_whatsapp',
        source = 'website',
        notes = '',
        adminPassword,
      } = body;

      const numRoomId = Number(room_id);
      const authorized = isAdmin || verifyAdminAuth(adminPassword);

      // Validation 1: Room ID range check
      if (isNaN(numRoomId) || numRoomId < 1 || numRoomId > 4) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Valid room_id (1-4) is required.' }));
        return;
      }

      // Validation 2: Date formats & chronological order
      if (!isValidDateStr(check_in) || !isValidDateStr(check_out)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Valid check_in and check_out dates in YYYY-MM-DD format are required.' }));
        return;
      }

      if (new Date(check_in).getTime() >= new Date(check_out).getTime()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Check-out date must be strictly after check-in date.' }));
        return;
      }

      // Validation 3: Anti-Hijacking Security Check
      // Public non-admin users CANNOT forge confirmed status or manual blocks!
      if ((source === 'manual_block' || status === 'confirmed') && !authorized) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            error: 'Unauthorized: Valid admin authentication required to create manual blocks or confirm bookings.',
          })
        );
        return;
      }

      // Sanitize inputs to prevent Stored XSS and SQL injection payloads
      const sanitizedName = sanitizeText(guest_name || (source === 'manual_block' ? 'Owner Reservation' : 'Guest'), 100);
      const sanitizedPhone = sanitizeText(guest_phone || 'N/A', 40);
      const sanitizedNotes = sanitizeText(notes, 500);

      const computedNights = Math.max(
        1,
        Number(nights) || Math.round((new Date(check_out).getTime() - new Date(check_in).getTime()) / 86400000)
      );

      const generatedRef =
        sanitizeText(booking_ref, 30) ||
        `VLN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            booking_ref: generatedRef,
            room_id: numRoomId,
            guest_name: sanitizedName,
            guest_phone: sanitizedPhone,
            guests_count: Math.min(6, Math.max(1, Number(guests_count) || 2)),
            check_in,
            check_out,
            nights: computedNights,
            total_price_pkr: Math.max(0, Number(total_price_pkr) || computedNights * 18000),
            status: source === 'manual_block' ? 'confirmed' : authorized ? status : 'pending_whatsapp',
            source: authorized ? source : 'website',
            notes: sanitizedNotes,
          },
        ])
        .select()
        .single();

      if (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, booking: data }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err?.message || 'Failed to create booking' }));
    }
    return;
  }

  // --------------------------------------------------------------------------
  // DELETE: Remove / Unblock a Booking (Strictly Admin Only)
  // --------------------------------------------------------------------------
  if (req.method === 'DELETE') {
    try {
      const url = new URL(req.url || '', 'http://localhost');
      const body = await parseJsonBody(req);
      const id = url.searchParams.get('id') || body.id;
      const adminPass = body.adminPassword;

      const authorized = isAdmin || verifyAdminAuth(adminPass);
      if (!authorized) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized: Valid admin authentication required to delete/unblock.' }));
        return;
      }

      if (!id || typeof id !== 'string') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Booking id is required.' }));
        return;
      }

      const { error } = await supabase.from('bookings').delete().eq('id', id);

      if (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, deletedId: id }));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err?.message || 'Failed to delete booking' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}
