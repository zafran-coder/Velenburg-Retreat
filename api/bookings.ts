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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

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

  const authHeader = req.headers['x-admin-password'] || req.headers['authorization'];
  const isAdmin = verifyAdminAuth(Array.isArray(authHeader) ? authHeader[0] : authHeader);

  // --------------------------------------------------------------------------
  // GET: List Bookings
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url || '', 'http://localhost');
      const roomId = url.searchParams.get('roomId');

      // Security & Data Privacy: Non-admins NEVER receive guest phone numbers or private notes
      let query = isAdmin
        ? supabase.from('bookings').select('*')
        : supabase.from('bookings').select('id, room_id, check_in, check_out, source, status').or('status.eq.confirmed,source.eq.manual_block');

      if (roomId) {
        query = query.eq('room_id', Number(roomId));
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
  // POST: Create Booking or Manual Block
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

      const authorized = isAdmin || verifyAdminAuth(adminPassword);

      // Protect manual blocks and confirmed status changes with Admin Password verification
      if ((source === 'manual_block' || status === 'confirmed') && !authorized) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            error: 'Unauthorized: Valid ADMIN_PASSWORD is required to create manual blocks or confirm bookings.',
          })
        );
        return;
      }

      if (!room_id || !check_in || !check_out) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'room_id, check_in, and check_out are required.' }));
        return;
      }

      const generatedRef = booking_ref || `VLN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            booking_ref: generatedRef,
            room_id: Number(room_id),
            guest_name: guest_name || (source === 'manual_block' ? 'Owner Manual Block' : 'Guest'),
            guest_phone: guest_phone || 'N/A',
            guests_count: Number(guests_count) || 2,
            check_in,
            check_out,
            nights: Number(nights) || 1,
            total_price_pkr: Number(total_price_pkr) || 18000,
            status: source === 'manual_block' ? 'confirmed' : status,
            source,
            notes,
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
  // DELETE: Remove / Unblock a Booking
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
        res.end(JSON.stringify({ error: 'Unauthorized: Valid ADMIN_PASSWORD required to delete/unblock.' }));
        return;
      }

      if (!id) {
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

