import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, checkRateLimit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`forgot_pass_${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    let resetToken = '';

    if (user) {
      resetToken = `rst_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 3600 * 1000).toISOString();
    }

    return NextResponse.json({
      success: true,
      message:
        'If an account exists with that email address, password reset instructions have been sent.',
      resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred while processing password reset request.' },
      { status: 500 }
    );
  }
}
