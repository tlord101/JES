'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { recordAudit } from '@/lib/audit';
import type { AuthActionState } from '@/lib/auth/action-state';
import { PARENT_PORTAL_ROLES, STUDENT_PORTAL_ROLES } from '@/lib/auth/roles';
import type { UserRole } from '@/types/database';

/**
 * Server actions for the family portals.
 *
 * Mirrors the guard used by the CMS and academics modules: environment check,
 * session check and role check in one place, so every action starts from a
 * trusted actor.
 */

const FAMILY_PORTAL_ROLES: UserRole[] = [...PARENT_PORTAL_ROLES, ...STUDENT_PORTAL_ROLES];

type FamilyActor = { id: string; email: string | null; fullName: string | null };

async function requireFamilyUser(): Promise<
  { ok: true; actor: FamilyActor } | { ok: false; state: AuthActionState }
> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      state: {
        status: 'error',
        message: 'Supabase is not configured yet. Add your project URL and keys to .env.local.',
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
    .select('role, is_active, full_name, email')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !profile.is_active || !FAMILY_PORTAL_ROLES.includes(profile.role)) {
    return {
      ok: false,
      state: { status: 'error', message: 'You do not have permission to use the family portals.' },
    };
  }

  return {
    ok: true,
    actor: { id: user.id, email: profile.email ?? null, fullName: profile.full_name ?? null },
  };
}

/**
 * Sends a portal message to a school office account.
 *
 * Parents and students may only write to the accounts returned by
 * `school_contacts()`, so the recipient list is never client-controlled.
 */
export async function sendMessageAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const guard = await requireFamilyUser();
  if (!guard.ok) return guard.state;
  const { actor } = guard;

  const headerList = await headers();
  const limit = rateLimit(clientKey(headerList, 'portal-message', actor.id), 20, 60_000);
  if (!limit.success) {
    return { status: 'error', message: `Too many messages. Try again in ${limit.retryAfterSeconds}s.` };
  }

  const recipientId = String(formData.get('recipientId') ?? '').trim();
  const studentId = String(formData.get('studentId') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!recipientId) {
    return { status: 'error', message: 'Choose the office you want to write to.' };
  }
  if (subject.length < 3) {
    return { status: 'error', message: 'Enter a subject of at least 3 characters.' };
  }
  if (body.length < 10) {
    return { status: 'error', message: 'Enter a message of at least 10 characters.' };
  }

  const supabase = await createClient();
  const { data: contacts } = await supabase.rpc('school_contacts', {});
  const recipient = (contacts ?? []).find((contact) => contact.profile_id === recipientId);

  if (!recipient) {
    return { status: 'error', message: 'Select a recipient from the school office list.' };
  }

  const { error } = await supabase.from('messages').insert({
    sender_id: actor.id,
    recipient_id: recipientId,
    student_id: studentId || null,
    subject,
    body: body.slice(0, 4000),
    is_read: false,
    read_at: null,
    parent_message_id: null,
  });

  if (error) {
    return { status: 'error', message: 'Could not send the message. Please try again.' };
  }

  await recordAudit({
    action: 'Portal message sent',
    category: 'Parent',
    details: `Message to ${recipient.full_name} — ${subject}`,
    actorId: actor.id,
    actorEmail: actor.email,
    actorName: actor.fullName,
  });

  revalidatePath('/parent/messages');
  revalidatePath('/parent');

  return { status: 'success', message: `Message sent to ${recipient.full_name}.` };
}

/** Marks one received message as read. */
export async function markMessageReadAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const guard = await requireFamilyUser();
  if (!guard.ok) return guard.state;

  const messageId = String(formData.get('messageId') ?? '').trim();
  if (!messageId) {
    return { status: 'error', message: 'That message could not be found.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', messageId)
    .eq('recipient_id', guard.actor.id);

  if (error) {
    return { status: 'error', message: 'Could not update the message.' };
  }

  revalidatePath('/parent/messages');
  revalidatePath('/parent');

  return { status: 'success', message: 'Message marked as read.' };
}
