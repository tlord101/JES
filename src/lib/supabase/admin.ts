import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { requirePublicSupabaseEnv, requireServiceRoleKey } from './env';

/**
 * Service-role Supabase client. NEVER import this from a client component.
 *
 * Used only for privileged operations that RLS cannot express: creating auth
 * users for staff/students/parents, promoting accounts and issuing account
 * emails. Every call site must verify the caller itself.
 */
export function createAdminClient() {
  const { url } = requirePublicSupabaseEnv();
  const serviceRoleKey = requireServiceRoleKey();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
