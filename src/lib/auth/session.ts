import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import type { Json, UserRole } from '@/types/database';
import { isUserRole, roleHome } from './roles';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  isVerified: boolean;
  notificationPreferences: Json;
};

export function isSupabaseConfigured(): boolean {
  return hasSupabaseEnv();
}

/**
 * Resolves the signed-in user together with the application profile row that
 * carries the role used for authorisation. Cached per request so multiple
 * components can ask for it without extra round trips.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      'id, email, full_name, role, phone, avatar_url, is_active, is_verified, notification_preferences'
    )
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) return null;

  if (!profile.is_active) return null;

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: isUserRole(profile.role) ? profile.role : 'student',
    phone: profile.phone,
    avatarUrl: profile.avatar_url,
    isActive: profile.is_active,
    isVerified: profile.is_verified,
    notificationPreferences: profile.notification_preferences,
  };
});

/** Same as {@link getCurrentUser} but redirects anonymous visitors to sign in. */
export async function requireUser(redirectTo?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const target = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';
    redirect(target);
  }
  return user;
}

/**
 * Requires the signed-in user to hold one of `roles`.
 * Anonymous visitors are sent to the matching portal login; signed-in users
 * without the role are sent to the "not authorised" screen.
 */
export async function requireRole(roles: UserRole[]): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!roles.includes(user.role)) {
    redirect('/not-authorised');
  }

  return user;
}

/** Convenience helper for pages that already resolved the user. */
export function homeForRole(role: UserRole | null | undefined): string {
  return roleHome(role);
}
