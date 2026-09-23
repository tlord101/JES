import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, Badge } from '@/lib/admin/ui';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AttendanceReportsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const date = typeof sp.date === 'string' && sp.date ? sp.date : new Date().toISOString().slice(0, 10);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select('id, status, student_id, class_id, class:classes(id, name, arm)')
    .eq('attendance_date', date)
    .limit(2000);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Attendance reports" />
        <div className="alert-danger">Failed to load attendance: {error.message}</div>
      </div>
    );
  }

  type Row = {
    status: string;
    class: { id: string; name: string; arm: string | null } | null;
  };
  const rows = (data ?? []) as unknown as Row[];

  const byClass = new Map<string, { label: string; present: number; absent: number; late: number; excused: number; total: number }>();
  for (const r of rows) {
    const key = r.class?.id ?? 'none';
    const label = r.class ? `${r.class.name}${r.class.arm ? ' ' + r.class.arm : ''}` : 'Unassigned';
    const bucket = byClass.get(key) ?? { label, present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    bucket.total += 1;
    if (r.status === 'present') bucket.present += 1;
    else if (r.status === 'absent') bucket.absent += 1;
    else if (r.status === 'late') bucket.late += 1;
    else if (r.status === 'excused') bucket.excused += 1;
    byClass.set(key, bucket);
  }

  const classes = [...byClass.values()].sort((a, b) => a.label.localeCompare(b.label));
  const totals = classes.reduce(
    (acc, c) => ({
      present: acc.present + c.present,
      absent: acc.absent + c.absent,
      late: acc.late + c.late,
      excused: acc.excused + c.excused,
      total: acc.total + c.total,
    }),
    { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
  );
  const rate = totals.total ? Math.round((totals.present / totals.total) * 100) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance reports"
        description="School-wide attendance summary for a single day."
        actions={
          <Link href="/admin/attendance" className="btn-secondary">
            Mark attendance
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form action="/admin/attendance/reports" className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-slate-600">Date</label>
        <input type="date" name="date" defaultValue={date} className="input-field max-w-[13rem]" />
        <button type="submit" className="btn-secondary">
          Load
        </button>
        <span className="text-sm text-slate-500">Showing {formatDate(date)}</span>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Attendance rate</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{rate === null ? '—' : `${rate}%`}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Present</div>
          <div className="mt-1 text-3xl font-bold text-emerald-600">{totals.present}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Absent</div>
          <div className="mt-1 text-3xl font-bold text-red-600">{totals.absent}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Late</div>
          <div className="mt-1 text-3xl font-bold text-amber-600">{totals.late}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Excused</div>
          <div className="mt-1 text-3xl font-bold text-sky-600">{totals.excused}</div>
        </div>
      </div>

      {classes.length === 0 ? (
        <EmptyState
          message={`No attendance was recorded for ${formatDate(date)}.`}
          cta={{ href: '/admin/attendance', label: 'Mark attendance' }}
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Class</th>
                <th className="text-right">Marked</th>
                <th className="text-right">Present</th>
                <th className="text-right">Absent</th>
                <th className="text-right">Late</th>
                <th className="text-right">Excused</th>
                <th className="text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => {
                const classRate = c.total ? Math.round((c.present / c.total) * 100) : 0;
                return (
                  <tr key={c.label}>
                    <td className="font-medium text-slate-900">{c.label}</td>
                    <td className="text-right tabular-nums">{c.total}</td>
                    <td className="text-right tabular-nums text-emerald-600">{c.present}</td>
                    <td className="text-right tabular-nums text-red-600">{c.absent}</td>
                    <td className="text-right tabular-nums text-amber-600">{c.late}</td>
                    <td className="text-right tabular-nums text-sky-600">{c.excused}</td>
                    <td className="text-right">
                      <Badge tone={classRate >= 80 ? 'success' : classRate >= 60 ? 'warning' : 'error'}>
                        {classRate}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
