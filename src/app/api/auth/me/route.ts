import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, findUserById } from '@/lib/auth';
import { ROLE_PERMISSIONS } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthenticated.' },
        { status: 401 }
      );
    }

    const user = findUserById(session.userId);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User account not found or deactivated.' },
        { status: 401 }
      );
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified,
      notificationPreferences: user.notificationPreferences,
      twoFactorEnabled: user.twoFactorEnabled,
      permissions: userPermissions,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      authenticated: true,
      user: safeUser,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred fetching user session.' },
      { status: 500 }
    );
  }
}
