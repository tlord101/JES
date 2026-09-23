import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Flash } from '@/lib/admin/ui';
import { StatusBadge, EmptyState } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string; actor?: string; q?: string }>;
}) {
  await requireRole(['super_admin', 'admin', 'principal', 'vice_principal', 'hod']);
  const { ok, err, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('audit_logs')
    .select('id, action, category, details, actor_email, actor_name, ip_address, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(300);

  if (q) {
    query = query.ilike('action', `%${q}%`);
  }

  const { data: logs, count } = await query;

  return (
    <div className="space-y-6 text-xs">
      <Flash ok={ok} err={err} />
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">System Audit &amp; Compliance Logs</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Real-time immutable audit trail tracking administrator operations, user creation, grade submissions, and CMS publishes.
        </p>
        {count !== null && <p className="text-xs text-[var(--muted-text)] mt-1">{count} total events logged</p>}
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Action Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Event Details</th>
              <th className="p-3">Performed By</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(logs ?? []).map((log) => (
              <tr key={log.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{log.action}</td>
                <td className="p-3">
                  <StatusBadge status={log.category} />
                </td>
                <td className="p-3 text-[var(--text)]">{log.details ?? '—'}</td>
                <td className="p-3 font-medium text-[var(--text)]">
                  {log.actor_name ?? log.actor_email ?? 'System'}
                  {(log.actor_email && log.actor_name !== log.actor_email) && (
                    <span className="text-[10px] text-[var(--muted-text)] block">{log.actor_email}</span>
                  )}
                </td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{log.created_at.replace('T', ' ').substring(0, 19)}</td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{log.ip_address ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs?.length && (
          <EmptyState message="No audit events recorded yet." />
        )}
      </div>
    </div>
  );
}
