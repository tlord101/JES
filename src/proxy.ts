import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy-client';

/**
 * Next.js 16 renamed `middleware` to `proxy`.
 *
 * Responsibilities (deliberately lightweight — no data fetching):
 *   1. Refresh the Supabase auth cookie on every matched request.
 *   2. Keep anonymous visitors out of the private portals and send them to the
 *      matching portal login with a `redirect` return path.
 *   3. Send already-authenticated users away from the login screens.
 *
 * Authorisation itself (which role may open which portal) is enforced again in
 * every portal layout via `requireRole()` against the profiles table, because
 * proxy checks are only an optimistic first pass.
 */

/** Private prefixes mapped to the portal login that should handle them. */
const PROTECTED_PREFIXES: { prefix: string; login: string }[] = [
  { prefix: '/admin', login: '/login/admin' },
  { prefix: '/staff/dashboard', login: '/login/staff' },
  { prefix: '/staff/my-classes', login: '/login/staff' },
  { prefix: '/staff/attendance', login: '/login/staff' },
  { prefix: '/staff/results-entry', login: '/login/staff' },
  { prefix: '/staff/students', login: '/login/staff' },
  { prefix: '/staff/announcements', login: '/login/staff' },
  { prefix: '/staff/profile', login: '/login/staff' },
  { prefix: '/staff/timetable', login: '/login/staff' },
  { prefix: '/parent', login: '/login/parent' },
  { prefix: '/student', login: '/login/student' },
  { prefix: '/profile', login: '/login' },
];

const LOGIN_PREFIXES = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { response, user, configured } = await updateSession(request);

  if (!configured) {
    // Without Supabase credentials the app is not usable; the public pages
    // render a configuration notice instead of failing with a stack trace.
    return response;
  }

  const protectedMatch = PROTECTED_PREFIXES.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  );

  if (!user && protectedMatch) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = protectedMatch.login;
    loginUrl.search = '';
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (user && LOGIN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    const home = request.nextUrl.clone();
    home.pathname = '/portal';
    home.search = '';
    return NextResponse.redirect(home);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on every path except Next.js internals and static assets so the auth
     * cookie stays fresh, but never block images, fonts or the manifest.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};
