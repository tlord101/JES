import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'jasmine-exclusive-school-jwt-secret-key-2025'
);
const AUTH_COOKIE_NAME = 'jes_session_token';

// Role route permissions
const ROUTE_ROLE_MAP: { prefix: string; allowedRoles: string[] }[] = [
  {
    prefix: '/admin',
    allowedRoles: ['Super Admin', 'Administrator', 'Principal', 'Vice Principal', 'HOD', 'Accountant'],
  },
  {
    prefix: '/staff',
    allowedRoles: ['Super Admin', 'Administrator', 'Principal', 'Vice Principal', 'HOD', 'Teacher', 'Accountant'],
  },
  {
    prefix: '/parent',
    allowedRoles: ['Parent', 'Super Admin', 'Administrator'],
  },
  {
    prefix: '/student',
    allowedRoles: ['Student', 'Super Admin', 'Administrator'],
  },
  {
    prefix: '/profile',
    allowedRoles: [
      'Super Admin',
      'Administrator',
      'Principal',
      'Vice Principal',
      'HOD',
      'Teacher',
      'Accountant',
      'Parent',
      'Student',
      'Alumni',
    ],
  },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedRoute = ROUTE_ROLE_MAP.find((route) => pathname.startsWith(route.prefix));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    if (!userRole || !matchedRoute.allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*', '/parent/:path*', '/student/:path*', '/profile/:path*'],
};
