import crypto from 'crypto';

// In-memory rate limiting store for failed login attempts
interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

// Clean up stale IP records every 30 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of rateLimitStore.entries()) {
    if (now - rec.firstAttempt > WINDOW_MS && (!rec.blockedUntil || now > rec.blockedUntil)) {
      rateLimitStore.delete(ip);
    }
  }
}, 30 * 60 * 1000).unref?.();

/**
 * Resolves the client IP address from serverless request headers
 */
export function getClientIp(req: any): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (forwarded) {
    const list = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return list.split(',')[0].trim();
  }
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Checks if the client IP is currently rate-limited
 */
export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // If currently locked out
  if (record.blockedUntil && now < record.blockedUntil) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds: retryAfter };
  }

  // Reset window if expired
  if (now - record.firstAttempt > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  return {
    allowed: record.attempts < MAX_FAILED_ATTEMPTS,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - record.attempts),
  };
}

/**
 * Records a failed login attempt and applies a lockout if threshold is exceeded
 */
export function recordFailedLogin(ip: string): { lockedOut: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    record = { attempts: 1, firstAttempt: now };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    rateLimitStore.set(ip, record);
    return { lockedOut: true, retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000) };
  }

  rateLimitStore.set(ip, record);
  return { lockedOut: false };
}

/**
 * Clears rate limiting on successful login
 */
export function resetLoginRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Timing-safe string comparison to prevent side-channel timing attacks
 */
export function timingSafeCompare(a?: string | null, b?: string | null): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = crypto.createHash('sha256').update(a).digest();
  const bufB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Secret key derivation for HMAC tokens
 */
function getTokenSecret(): string {
  const base = process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || 'velenburg-fallback-salt';
  return crypto.createHash('sha256').update(`velenburg-jwt-salt-${base}`).digest('hex');
}

export interface AdminTokenPayload {
  role: 'admin';
  iat: number;
  exp: number;
  nonce: string;
}

/**
 * Generates a tamper-proof cryptographically signed Admin Session Token
 * Token expires in 12 hours.
 */
export function createAdminSessionToken(expiresInSeconds = 43200): { token: string; expiresIn: number } {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminTokenPayload = {
    role: 'admin',
    iat: now,
    exp: now + expiresInSeconds,
    nonce: crypto.randomBytes(12).toString('hex'),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getTokenSecret())
    .update(payloadB64)
    .digest('base64url');

  const token = `vln_adm.${payloadB64}.${signature}`;
  return { token, expiresIn: expiresInSeconds };
}

/**
 * Validates the HMAC signature and expiration timestamp of an Admin Session Token
 */
export function verifyAdminSessionToken(token: string): boolean {
  if (!token || !token.startsWith('vln_adm.')) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [, payloadB64, providedSig] = parts;

  // Recompute HMAC signature
  const expectedSig = crypto
    .createHmac('sha256', getTokenSecret())
    .update(payloadB64)
    .digest('base64url');

  if (!timingSafeCompare(providedSig, expectedSig)) {
    return false;
  }

  try {
    const raw = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const parsed: AdminTokenPayload = JSON.parse(raw);

    const now = Math.floor(Date.now() / 1000);
    if (parsed.role !== 'admin') return false;
    if (typeof parsed.exp !== 'number' || now > parsed.exp) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates SSRF protection on iCal calendar URLs
 * Only allows external HTTPS URLs, prevents accessing internal private IP ranges or cloud metadata
 */
export function isSafeIcalUrl(urlStr: string): { safe: boolean; error?: string } {
  if (!urlStr || typeof urlStr !== 'string') {
    return { safe: false, error: 'URL is required' };
  }

  const trimmed = urlStr.trim();
  if (trimmed.length > 1024) {
    return { safe: false, error: 'URL exceeds maximum allowed length of 1024 characters' };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return { safe: false, error: 'Only secure HTTPS calendar URLs are permitted' };
    }

    const host = parsed.hostname.toLowerCase();

    // Block localhost & loopback
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1') {
      return { safe: false, error: 'Internal loopback addresses are blocked' };
    }

    // Block cloud metadata services (e.g., 169.254.169.254)
    if (host === '169.254.169.254' || host.includes('metadata.google') || host.includes('metadata.internal')) {
      return { safe: false, error: 'Cloud metadata access is forbidden' };
    }

    // Block private subnets (RFC 1918)
    if (
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      host.endsWith('.local') ||
      host.endsWith('.internal')
    ) {
      return { safe: false, error: 'Private network addresses are blocked' };
    }

    // Ensure valid domain with at least one dot
    if (!host.includes('.')) {
      return { safe: false, error: 'Invalid domain name in URL' };
    }

    return { safe: true };
  } catch {
    return { safe: false, error: 'Malformed URL format' };
  }
}

/**
 * Strips script tags, HTML tags, and truncates text to prevent Stored XSS
 */
export function sanitizeText(val: any, maxLen = 200): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        case '&': return '&amp;';
        default: return char;
      }
    })
    .trim()
    .slice(0, maxLen);
}

/**
 * Validates ISO Date format YYYY-MM-DD
 */
export function isValidDateStr(dateStr: any): boolean {
  if (typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}
