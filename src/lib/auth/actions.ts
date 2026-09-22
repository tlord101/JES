'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { recordAudit } from '@/lib/audit';
import {
  fieldErrors,
  forgotPasswordSchema,
  profileUpdateSchema,
  registerSchema,
  resetPasswordSchema,
  signInSchema,
} from '@/lib/validation/auth';
import { isPortalId, isUserRole, PORTALS, roleHome } from './roles';
import type { AuthActionState } from './action-state';

function configurationError(): AuthActionState {
  return {
    status: 'error',
    message:
      'Supabase is not configured yet. Copy .env.example to .env.local and add your project URL and anon key.',
  };
}

async function requestContext() {
  const headerList = await headers();
  return {
    ip: headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: headerList.get('user-agent') ?? null,
  };
}

/**
 * Verifies credentials with Supabase Auth, enforces the portal's role list and
 * redirects the user to their role home. Never stores a password anywhere.
 */
export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) return configurationError();

  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    portal: (formData.get('portal') as string | null) ?? undefined,
    redirect: (formData.get('redirect') as string | null) ?? undefined,
  });

  if (!parsed.success) {
    return { status: 'error', errors: fieldErrors(parsed.error), message: 'Check the form and try again.' };
  }

  const { email, password, portal, redirect: redirectTo } = parsed.data;
  const headerList = await headers();

  const limit = rateLimit(clientKey(headerList, 'signin', email), 8, 60_000);
  if (!limit.success) {
    return {
      status: 'error',
      message: `Too many sign-in attempts. Please try again in ${limit.retryAfterSeconds} seconds.`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    const context = await requestContext();
    await recordAudit({
      action: 'Sign-in failed',
      category: 'Auth',
      details: `Failed sign-in attempt for ${email}`,
      actorEmail: email,
      ipAddress: context.ip,
      userAgent: context.userAgent,
    });

    return { status: 'error', message: 'Invalid email address or password.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return {
      status: 'error',
      message: 'Your account has no school profile yet. Please contact the school administrator.',
    };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return {
      status: 'error',
      message: 'This account has been disabled. Please contact the school administration.',
    };
  }

  if (!isUserRole(profile.role)) {
    await supabase.auth.signOut();
    return { status: 'error', message: 'This account has an unrecognised role.' };
  }

  const context = await requestContext();
  await recordAudit({
    action: 'Sign-in',
    category: 'Auth',
    details: `${profile.role} signed in`,
    actorId: data.user.id,
    actorEmail: email,
    ipAddress: context.ip,
    userAgent: context.userAgent,
  });

  // Opportunistic last-login stamp; failure is not fatal.
  await supabase
    .from('profiles')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', data.user.id);

  const destination =
    redirectTo && redirectTo.startsWith('/') ? redirectTo : roleHome(profile.role);

  // A visitor who opened the wrong portal login is sent to their own portal
  // instead of being dropped into a dashboard they cannot use.
  if (portal && isPortalId(portal) && !PORTALS[portal].roles.includes(profile.role)) {
    redirect(roleHome(profile.role));
  }

  redirect(destination);
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) return configurationError();

  const parsed = registerSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    role: (formData.get('role') as string | null) ?? 'parent',
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      errors: fieldErrors(parsed.error),
      message: 'Please correct the highlighted fields.',
    };
  }

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'register'), 5, 10 * 60_000);
  if (!limit.success) {
    return {
      status: 'error',
      message: `Too many registration attempts. Try again in ${limit.retryAfterSeconds} seconds.`,
    };
  }

  const { fullName, email, phone, role, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/login`,
    },
  });

  if (error) {
    return {
      status: 'error',
      message: error.message.includes('already registered')
        ? 'An account already exists for this email address.'
        : 'We could not create the account. Please try again.',
    };
  }

  const context = await requestContext();
  await recordAudit({
    action: 'Account registered',
    category: 'Auth',
    details: `Self-service ${role} account created for ${email}`,
    actorId: data.user?.id ?? null,
    actorEmail: email,
    actorName: fullName,
    ipAddress: context.ip,
    userAgent: context.userAgent,
  });

  return {
    status: 'success',
    message:
      'Account created. Check your email inbox for the confirmation link, then sign in to your portal.',
  };
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) return configurationError();

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return {
      status: 'error',
      errors: fieldErrors(parsed.error),
      message: 'Enter a valid email address.',
    };
  }

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'forgot', parsed.data.email), 5, 10 * 60_000);
  if (!limit.success) {
    return {
      status: 'error',
      message: `Too many requests. Try again in ${limit.retryAfterSeconds} seconds.`,
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  // Always the same answer, so the endpoint cannot be used to discover which
  // email addresses have accounts.
  return {
    status: 'success',
    message:
      'If an account exists for that email address, a password reset link has been sent.',
  };
}

export async function updatePasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) return configurationError();

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      errors: fieldErrors(parsed.error),
      message: 'Please choose a stronger password.',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: 'Your reset link has expired. Please request a new password reset email.',
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      status: 'error',
      message: 'We could not update the password. Please request a new reset link.',
    };
  }

  const context = await requestContext();
  await recordAudit({
    action: 'Password reset',
    category: 'Auth',
    details: 'Password changed through the reset-password screen',
    actorId: user.id,
    actorEmail: user.email ?? null,
    ipAddress: context.ip,
    userAgent: context.userAgent,
  });

  return { status: 'success', message: 'Password updated. You can now use your new password.' };
}

export async function resendVerificationAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) return configurationError();

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return {
      status: 'error',
      errors: fieldErrors(parsed.error),
      message: 'Enter a valid email address.',
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

  await supabase.auth.resend({
    type: 'signup',
    email: parsed.data.email,
    options: { emailRedirectTo: `${siteUrl}/login` },
  });

  return {
    status: 'success',
    message: 'If that address needs confirmation, a new verification email is on its way.',
  };
}

export async function updateProfileAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!hasSupabaseEnv()) return configurationError();

  const parsed = profileUpdateSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone') ?? '',
    avatarUrl: formData.get('avatarUrl') ?? '',
  });

  if (!parsed.success) {
    return {
      status: 'error',
      errors: fieldErrors(parsed.error),
      message: 'Please review the form.',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: 'error', message: 'You are not signed in.' };

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone ? parsed.data.phone : null,
      avatar_url: parsed.data.avatarUrl ? parsed.data.avatarUrl : null,
    })
    .eq('id', user.id);

  if (error) {
    return { status: 'error', message: 'We could not save your changes. Please try again.' };
  }

  await recordAudit({
    action: 'Profile updated',
    category: 'User',
    details: 'User updated their own contact details',
    actorId: user.id,
    actorEmail: user.email ?? null,
  });

  return { status: 'success', message: 'Your profile has been updated.' };
}

export async function signOutAction(): Promise<void> {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const context = await requestContext();
      await recordAudit({
        action: 'Sign-out',
        category: 'Auth',
        details: 'User signed out',
        actorId: user.id,
        actorEmail: user.email ?? null,
        ipAddress: context.ip,
        userAgent: context.userAgent,
      });
    }

    await supabase.auth.signOut();
  }

  redirect('/login');
}
