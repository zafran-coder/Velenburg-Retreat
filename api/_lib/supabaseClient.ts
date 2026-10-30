import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { timingSafeCompare, verifyAdminSessionToken } from './security';

// Lazy-loaded Supabase client instance
let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('your-project-id')) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}

/**
 * Verifies admin authentication using either:
 * 1. Cryptographically signed HMAC Admin Session Token (Bearer vln_adm...)
 * 2. Timing-safe verification of the configured ADMIN_PASSWORD
 */
export function verifyAdminAuth(authHeaderOrPassword?: string | null): boolean {
  if (!authHeaderOrPassword) return false;

  const cleaned = authHeaderOrPassword.replace(/^Bearer\s+/i, '').trim();

  // First check if it's an HMAC session token
  if (cleaned.startsWith('vln_adm.')) {
    return verifyAdminSessionToken(cleaned);
  }

  // Otherwise perform a timing-safe password comparison
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return false;

  return timingSafeCompare(cleaned, configuredPassword.trim());
}
