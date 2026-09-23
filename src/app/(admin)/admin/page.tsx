import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, StatusBadge } from '@/lib/admin/ui';
import { formatDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const { ok, err } = await searchParams;
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [students, staff, applications, invoices, messages, attendanceToday, news, recentApps] =
    await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }),
      supabase.from('staff').select('id', { count: 'exact', head: true }),
      supabase.from('admission_applications').select('id', { count: 'exact', head: true }),
      supabase.from('invoices').select('balance, status').neq('status', 'cancelled').limit(1000),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('attendance').select('status').eq('attendance_date', today).limit(2000),
      supabase.from('news').select('id, title, slug, published_at, status').order('created_at', { ascending: false }).limit(5),
      supabase
        .from('admission_applications')
        .select('id, first_name, last_name, class_applying_for, status, submitted_at')
        .order('submitted_at', { ascending: false })
        .limit(6),
    ]);

  const outstanding = (invoices.data ?? []).reduce(
    (sum, row) => sum + Number(row.balance ?? 0),
    0,
  );
  const markedToday = (attendanceToday.data ?? []).length;
  const presentToday = (attendanceToday.data ?? []).filter((r) => r.status === 'present').length;

  const tiles = [
    { label: 'Students', value: students.count ?? 0, href: '/admin/students' },
    { label: 'Staff', value: staff.count ?? 0, href: '/admin/staff' },
    { label: 'Applications', value: applications.count ?? 0, href: '/admin/applications' },
    { label: 'Unread messages', value: messages.count ?? 0, href: '/admin/messages' },
    { label: 'Outstanding fees', value: `₦${outstanding.toLocaleString()}`, href: '/admin/fees' },
    {
      label: 'Attendance today',
      value: markedToday ? `${presentToday}/${markedToday}` : '—',
      href: '/admin/attendance',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Live figures from the Supabase database."
        actions={
          <Link href="/admin/applications" className="btn-primary">
            Review applications
          </Link>
        }
      />
      <Flash ok={ok} err={err} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="card hover:border-primary-300">
            <div className="text-xs text-slate-500">{t.label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{t.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Latest applications</h2>
            <Link href="/admin/applications" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {recentApps.data && recentApps.data.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.data.map((app) => (
                  <tr key={app.id}>
                    <td className="font-medium text-slate-900">{app.first_name} {app.last_name}</td>
                    <td>{app.class_applying_for || '—'}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>{formatDateTime(app.submitted_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-500">No applications yet.</p>
          )}
        </section>

        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent news</h2>
            <Link href="/admin/news" className="text-sm text-primary-600 hover:underline">
              Manage
            </Link>
          </div>
          {news.data && news.data.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {news.data.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-sm text-slate-700">{n.title}</span>
                  <StatusBadge status={n.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No news articles yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
