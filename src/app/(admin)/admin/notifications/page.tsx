import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/format';
import { Badge } from '@/lib/admin/ui';
import { ADMIN_PORTAL_ROLES, ROLE_LABELS } from '@/lib/auth/roles';

export const metadata = { title: 'Notifications' };

export default async function NotificationsPage() {
  await requireRole(ADMIN_PORTAL_ROLES);
  const supabase = await createClient();

  const [{ data: notifications }, { count: contactCount }] = await Promise.all([
    supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
  ]);

  const rows = notifications ?? [];
  const unread = rows.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Total</div>
          <div className="text-2xl font-bold text-slate-900">{rows.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Unread</div>
          <div className="text-2xl font-bold text-amber-600">{unread}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Contact messages</div>
          <div className="text-2xl font-bold text-slate-900">{contactCount ?? 0}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium text-slate-500">Recipients</div>
          <div className="text-2xl font-bold text-slate-900">
            {new Set(rows.map((n) => n.profile_id)).size}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {n.profile_id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3">
                  <Badge tone="info">{n.type}</Badge>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{n.title}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(n.created_at)}</td>
                <td className="px-4 py-3">
                  <Badge tone={n.is_read ? 'success' : 'warning'}>
                    {n.is_read ? 'Read' : 'Unread'}
                  </Badge>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No notifications yet.{' '}
                  {contactCount ? (
                    <Link href="/admin/messages" className="text-emerald-700 underline">
                      {contactCount} contact message{contactCount > 1 ? 's' : ''} are waiting
                    </Link>
                  ) : null}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        Live from the <code>notifications</code> and <code>contact_messages</code> tables. Directory
        roles: {Object.values(ROLE_LABELS).join(' · ')}.
      </p>
    </div>
  );
}
