import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { requirePublicSupabaseEnv } from './env';

/**
 * Server-side Supabase client bound to the incoming request cookies.
 *
 * `cookies()` is asynchronous in Next.js 16 and must be awaited.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = requirePublicSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render: cookies are read-only here.
          // Session refresh is handled by src/proxy.ts instead.
        }
      },
    },
  });
}
