import { getSupabaseAdmin, verifyAdminAuth } from './_lib/supabaseClient';
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
  getClientIp,
  createAdminSessionToken,
  isSafeIcalUrl,
} from './_lib/security';

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

  // Secure CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const clientIp = getClientIp(req);
  const body = req.method === 'POST' ? await parseJsonBody(req) : {};
  const authHeader = req.headers['authorization'] || req.headers['x-admin-password'];
  const providedAuth =
    (Array.isArray(authHeader) ? authHeader[0] : authHeader) || body?.password || body?.adminPassword;

  const url = new URL(req.url || '', 'http://localhost');
  const action = url.searchParams.get('action') || body?.action;

  // --------------------------------------------------------------------------
  // Action: Verify Admin Passcode with Brute-Force Rate Limiting & Session Token
  // --------------------------------------------------------------------------
  if (action === 'verify' || body?.action === 'verify') {
    // 1. Check rate limit
    const rateCheck = checkLoginRateLimit(clientIp);
    if (!rateCheck.allowed) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', String(rateCheck.retryAfterSeconds || 900));
      res.end(
        JSON.stringify({
          success: false,
          error: `Security Lockout: Too many failed login attempts from this IP. Please try again in ${Math.ceil(
            (rateCheck.retryAfterSeconds || 900) / 60
          )} minutes.`,
        })
      );
      return;
    }

    const isCorrect = verifyAdminAuth(providedAuth);
    if (!isCorrect) {
      const failStatus = recordFailedLogin(clientIp);
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');

      if (failStatus.lockedOut) {
        res.end(
          JSON.stringify({
            success: false,
            error: 'Security Lockout: Maximum login attempts exceeded. Account access locked for 15 minutes.',
          })
        );
      } else {
        res.end(
          JSON.stringify({
            success: false,
            error: `Incorrect admin passcode. ${rateCheck.remainingAttempts - 1} attempt(s) remaining before security lockout.`,
          })
        );
      }
      return;
    }

    // Reset rate limiter on valid credential
    resetLoginRateLimit(clientIp);

    // Issue ephemeral signed HMAC session token (valid for 12 hours)
    const { token, expiresIn } = createAdminSessionToken(43200);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        token,
        expiresIn,
        message: 'Admin authenticated successfully with cryptographic session token.',
      })
    );
    return;
  }

  // --------------------------------------------------------------------------
  // Guard all subsequent admin endpoints with strict verification
  // --------------------------------------------------------------------------
  if (!verifyAdminAuth(providedAuth)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized: Valid admin session token or password required.' }));
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
  // Action: Update Room iCal URLs with SSRF Validation
  // --------------------------------------------------------------------------
  if (action === 'update_ical_urls') {
    try {
      const { roomId, airbnbIcalUrl, bookingComIcalUrl } = body;
      const numRoomId = Number(roomId);

      if (!roomId || isNaN(numRoomId) || numRoomId < 1 || numRoomId > 4) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid roomId. Must be between 1 and 4.' }));
        return;
      }

      // SSRF Validation for Airbnb URL
      if (airbnbIcalUrl && typeof airbnbIcalUrl === 'string' && airbnbIcalUrl.trim()) {
        const check = isSafeIcalUrl(airbnbIcalUrl);
        if (!check.safe) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Security check failed for Airbnb iCal URL: ${check.error}` }));
          return;
        }
      }

      // SSRF Validation for Booking.com URL
      if (bookingComIcalUrl && typeof bookingComIcalUrl === 'string' && bookingComIcalUrl.trim()) {
        const check = isSafeIcalUrl(bookingComIcalUrl);
        if (!check.safe) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Security check failed for Booking.com iCal URL: ${check.error}` }));
          return;
        }
      }

      const { data, error } = await supabase
        .from('rooms')
        .upsert(
          {
            id: numRoomId,
            name: `Room ${numRoomId} — Luxury Suite 0${numRoomId}`,
            slug: `room-${numRoomId}`,
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
  // Action: Update Booking Status
  // --------------------------------------------------------------------------
  if (action === 'update_status') {
    try {
      const { bookingId, status } = body;
      const validStatuses = ['pending_whatsapp', 'confirmed', 'cancelled'];

      if (!bookingId || !status || !validStatuses.includes(status)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Valid bookingId and recognized status are required.' }));
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
