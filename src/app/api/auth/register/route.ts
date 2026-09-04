import { NextRequest, NextResponse } from 'next/server';
import { usersStore, User, UserType } from '@/lib/db';
import {
  findUserByEmail,
  hashPassword,
  checkRateLimit,
} from '@/lib/auth';

const VALID_ROLES: UserType[] = [
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
];

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`register_${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, password, phone, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const userRole: UserType = VALID_ROLES.includes(role) ? role : 'Parent';

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || '',
      role: userRole,
      isActive: true,
      isEmailVerified: false,
      verificationToken: `vtoken_${Math.random().toString(36).substring(2)}`,
      notificationPreferences: { email: true, sms: true, announcements: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersStore.push(newUser);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Verification email dispatched.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred during account registration.' },
      { status: 500 }
    );
  }
}
