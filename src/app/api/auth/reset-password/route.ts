import { NextRequest, NextResponse } from 'next/server';
import { usersStore } from '@/lib/db';
import { hashPassword, checkRateLimit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`reset_pass_${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Reset token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const user = usersStore.find(
      (u) =>
        u.resetToken === token &&
        u.resetTokenExpiry &&
        new Date(u.resetTokenExpiry) > new Date()
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token.' },
        { status: 400 }
      );
    }

    user.passwordHash = await hashPassword(newPassword);
    delete user.resetToken;
    delete user.resetTokenExpiry;
    user.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred while resetting password.' },
      { status: 500 }
    );
  }
}
