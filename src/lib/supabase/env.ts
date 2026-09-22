/**
 * Centralised Supabase environment resolution.
 *
 * Every value lives in `.env.local` (see `.env.example`). Nothing in this
 * project ever hard-codes a URL or key, and only NEXT_PUBLIC_* values are
 * allowed to reach the browser bundle.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill in your Supabase project credentials.`
    );
  }
  return value;
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function requirePublicSupabaseEnv(): { url: string; anonKey: string } {
  return {
    url: required('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL),
    anonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY),
  };
}

export function requireServiceRoleKey(): string {
  return required('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasSupabaseEnv(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export const SUPABASE_MEDIA_BUCKET = 'public-media';
export const SUPABASE_AVATAR_BUCKET = 'avatars';
export const SUPABASE_DOCUMENT_BUCKET = 'private-documents';

/**
 * Public URL for an object stored in Supabase Storage. Returns null when the
 * value is already an absolute URL (seeded/external assets) or empty.
 */
export function publicStorageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!SUPABASE_URL) return null;
  return `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${path.replace(/^\//, '')}`;
}
