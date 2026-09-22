import { createClient } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import type { Json } from '@/types/database';

export type AuditCategory =
  | 'Auth'
  | 'User'
  | 'Student'
  | 'Parent'
  | 'Staff'
  | 'CMS'
  | 'Finance'
  | 'Admissions'
  | 'System';

export type AuditInput = {
  action: string;
  category: AuditCategory;
  details?: string;
  actorId?: string | null;
  actorEmail?: string | null;
  actorName?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Json;
};

/**
 * Writes an entry to `audit_logs`.
 *
 * Audit failures must never break the user-facing action, so problems are
 * reported to the server log and swallowed.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  if (!hasSupabaseEnv()) return;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('audit_logs').insert({
      action: input.action,
      category: input.category,
      details: input.details ?? null,
      actor_id: input.actorId ?? null,
      actor_email: input.actorEmail ?? null,
      actor_name: input.actorName ?? null,
      ip_address: input.ipAddress ?? null,
      user_agent: input.userAgent ?? null,
      metadata: input.metadata ?? {},
    });

    if (error) {
      console.error('[audit] failed to write audit log', error.message);
    }
  } catch (error) {
    console.error('[audit] unexpected failure', error);
  }
}
