'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { recordAudit } from '@/lib/audit';
import { createUserSchema, updateUserSchema } from '@/lib/validation/users';
import type { AuthActionState } from '@/lib/auth/action-state';
import type { UserRole } from '@/types/database';

async function requireManager(): Promise<
  { ok: true; actorId: string; actorEmail: string | null; actorName: string | null } | { ok: false; state: AuthActionState }
> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      state: {
        status: 'error',
        message:
          'Supabase is not configured yet. Copy .env.example to .env.local and add your project URL and keys.',
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, state: { status: 'error', message: 'You are not signed in.' } };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active, full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !profile.is_active || (profile.role !== 'super_admin' && profile.role !== 'admin')) {
    return {
      ok: false,
      state: { status: 'error', message: 'You do not have permission to manage user accounts.' },
    };
  }

  return {
    ok: true,
    actorId: user.id,
    actorEmail: user.email ?? null,
    actorName: profile.full_name ?? null,
  };
}

/** Creates an auth user + profile (+ linked role record) with the service role. */
export async function createUserAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireManager();
  if (!manager.ok) return manager.state;

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'create-user', manager.actorId), 10, 60_000);
  if (!limit.success) {
    return {
      status: 'error',
      message: `Too many requests. Please try again in ${limit.retryAfterSeconds} seconds.`,
    };
  }

  const parsed = createUserSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    role: formData.get('role'),
    password: formData.get('password'),
    gender: formData.get('gender') || undefined,
    dateOfBirth: formData.get('dateOfBirth') || undefined,
    classId: formData.get('classId') || undefined,
    admissionNo: formData.get('admissionNo') || undefined,
    position: formData.get('position') || undefined,
    department: formData.get('department') || undefined,
    staffNo: formData.get('staffNo') || undefined,
    occupation: formData.get('occupation') || undefined,
    relationship: formData.get('relationship') || undefined,
    address: formData.get('address') || undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: 'error', errors, message: 'Please review the form.' };
  }

  const input = parsed.data;
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('email', input.email)
    .maybeSingle();
  if (existing) {
    return { status: 'error', message: 'An account with that email already exists.' };
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName, role: input.role },
  });

  if (createError || !created.user) {
    return { status: 'error', message: 'Could not create the account. Please try again.' };
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: created.user.id,
    email: input.email,
    full_name: input.fullName,
    phone: input.phone,
    role: input.role as UserRole,
    is_active: true,
    is_verified: true,
  });

  if (profileError) {
    // Roll back the auth user so no orphan accounts linger.
    await admin.auth.admin.deleteUser(created.user.id);
    return { status: 'error', message: 'Could not create the school profile. Please try again.' };
  }

  if (input.role === 'student') {
    const admissionNo =
      input.admissionNo && input.admissionNo.length > 0
        ? input.admissionNo
        : `JES/${new Date().getFullYear()}/${Date.now().toString().slice(-6)}`;

    const { error: studentError } = await admin.from('students').insert({
      profile_id: created.user.id,
      admission_no: admissionNo,
      gender: input.gender ?? null,
      date_of_birth: input.dateOfBirth && input.dateOfBirth.length > 0 ? input.dateOfBirth : null,
      class_id: input.classId && input.classId.length > 0 ? input.classId : null,
    });

    if (studentError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return { status: 'error', message: 'Could not create the student record. Please try again.' };
    }
  } else if (input.role === 'teacher' || input.role === 'hod') {
    const staffNo =
      input.staffNo && input.staffNo.length > 0 ? input.staffNo : `JSS/${Date.now().toString().slice(-6)}`;

    const { error: staffError } = await admin.from('staff').insert({
      profile_id: created.user.id,
      staff_no: staffNo,
      position: input.position && input.position.length > 0 ? input.position : 'Teacher',
      department: input.department && input.department.length > 0 ? input.department : null,
    });

    if (staffError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return { status: 'error', message: 'Could not create the staff record. Please try again.' };
    }
  } else if (input.role === 'parent') {
    const { error: parentError } = await admin.from('parents').insert({
      profile_id: created.user.id,
      occupation: input.occupation && input.occupation.length > 0 ? input.occupation : null,
      relationship: input.relationship && input.relationship.length > 0 ? input.relationship : 'guardian',
      address: input.address && input.address.length > 0 ? input.address : null,
    });

    if (parentError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return { status: 'error', message: 'Could not create the parent record. Please try again.' };
    }
  }

  await recordAudit({
    action: 'User created',
    category: 'User',
    details: `Created ${input.role} account for ${input.email}`,
    actorId: manager.actorId,
    actorEmail: manager.actorEmail,
    actorName: manager.actorName,
  });

  revalidatePath('/admin/users');
  return { status: 'success', message: `Account for ${input.email} has been created.` };
}


/** Updates profile fields for an existing account. */
export async function updateUserAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireManager();
  if (!manager.ok) return manager.state;

  const userId = formData.get('userId');
  if (typeof userId !== 'string' || userId.length === 0) {
    return { status: 'error', message: 'Missing user identifier.' };
  }

  const parsed = updateUserSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone') ?? '',
    role: formData.get('role'),
    isActive: formData.get('isActive'),
    isVerified: formData.get('isVerified'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Please review the form.' };
  }

  const supabase = await createClient();
  const { data: current } = await supabase
    .from('profiles')
    .select('email, role')
    .eq('id', userId)
    .maybeSingle();

  if (!current) {
    return { status: 'error', message: 'That account no longer exists.' };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone && parsed.data.phone.length > 0 ? parsed.data.phone : null,
      role: parsed.data.role as UserRole,
      is_active: parsed.data.isActive === 'true',
      is_verified: parsed.data.isVerified === 'true',
    })
    .eq('id', userId);

  if (error) {
    return { status: 'error', message: 'Could not save the changes. Please try again.' };
  }

  // Also ban/unban the auth user so disabled accounts cannot sign in.
  await admin.auth.admin.updateUserById(userId, {
    ban_duration: parsed.data.isActive === 'true' ? 'none' : '876000h',
  });

  const roleChanged = current.role !== parsed.data.role;
  await recordAudit({
    action: 'User updated',
    category: 'User',
    details: `Updated account for ${current.email}${roleChanged ? ` (role ${current.role} -> ${parsed.data.role})` : ''}`,
    actorId: manager.actorId,
    actorEmail: manager.actorEmail,
    actorName: manager.actorName,
  });

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath('/admin/users');
  return { status: 'success', message: 'User record updated successfully.' };
}

/** Admin password override - sends a reset link instead of storing anything. */
export async function sendPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const manager = await requireManager();
  if (!manager.ok) return manager.state;

  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { status: 'error', message: 'Missing email address.' };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  await recordAudit({
    action: 'Password reset link sent',
    category: 'User',
    details: `Admin sent a password reset link to ${email}`,
    actorId: manager.actorId,
    actorEmail: manager.actorEmail,
    actorName: manager.actorName,
  });

  return { status: 'success', message: `A password reset link has been sent to ${email}.` };
}
