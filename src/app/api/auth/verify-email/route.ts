import { NextRequest, NextResponse } from 'next/server';
import { usersStore } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required.' },
        { status: 400 }
      );
    }

    const user = usersStore.find((u) => u.verificationToken === token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token.' },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    delete user.verificationToken;
    user.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now access all portal features.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred during email verification.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Verification token is required.' },
      { status: 400 }
    );
  }

  const user = usersStore.find((u) => u.verificationToken === token);

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired verification token.' },
      { status: 400 }
    );
  }

  user.isEmailVerified = true;
  delete user.verificationToken;
  user.updatedAt = new Date().toISOString();

  return NextResponse.json({
    success: true,
    message: 'Email verified successfully. You can now access all portal features.',
  });
}
