import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

export function verifyAdminAuth(authHeaderOrPassword?: string | null): boolean {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword || !authHeaderOrPassword) return false;

  // Clean Bearer prefix if provided
  const cleaned = authHeaderOrPassword.replace(/^Bearer\s+/i, '').trim();
  return cleaned === configuredPassword.trim();
}

