import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * Current session for client components (portal dashboards, user menus).
 * Backed by the Supabase session cookie — no custom JWT.
 */
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ authenticated: false, error: 'Unauthenticated.' }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      isEmailVerified: user.isVerified,
      notificationPreferences: user.notificationPreferences,
    },
  });
}
