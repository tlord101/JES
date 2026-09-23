import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, StatusBadge, EmptyState } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AdminAttendancePage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const date = typeof sp.date === 'string' && sp.date ? sp.date : new Date().toISOString().slice(0, 10);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select(
      'id, attendance_date, status, remarks, student:students(id, admission_no, profile:profiles(full_name), class:classes(name, arm))',
    )
    .eq('attendance_date', date)
    .order('created_at')
    .limit(2000);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Attendance" />
        <div className="alert-danger">Failed to load attendance: {error.message}</div>
      </div>
    );
  }

  const rows = (data ?? []) as unknown as {
    id: string;
    attendance_date: string;
    status: string;
    remarks: string | null;
    student: {
      id: string;
      admission_no: string | null;
      profile: { full_name: string } | null;
      class: { name: string; arm: string | null } | null;
    } | null;
  }[];

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Daily register — marking is done by class teachers in the Staff portal."
        actions={
          <Link href="/staff/attendance" className="btn-secondary">
            Open marking view
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form className="flex flex-wrap items-end gap-3" action="/admin/attendance">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Date</span>
          <input type="date" name="date" defaultValue={date} className="input-field" />
        </label>
        <button type="submit" className="btn-secondary">
          Load day
        </button>
      </form>

      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
        {Object.entries(counts).map(([status, n]) => (
          <span key={status} className="rounded-full bg-slate-100 px-3 py-1 capitalize">
            {status}: <strong>{n}</strong>
          </span>
        ))}
        <span className="rounded-full bg-slate-100 px-3 py-1">
          Total marked: <strong>{rows.length}</strong>
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No register for this day"
          body="Nothing has been marked for the selected date."
          action={<Link href="/staff/attendance" className="btn-primary">Mark attendance</Link>}
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Adm. no</th>
                <th>Class</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-slate-900">
                    {r.student?.profile?.full_name ?? 'Unknown'}
                  </td>
                  <td className="font-mono text-xs">{r.student?.admission_no || '—'}</td>
                  <td>
                    {r.student?.class
                      ? `${r.student.class.name}${r.student.class.arm ? ' ' + r.student.class.arm : ''}`
                      : '—'}
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-sm text-slate-500">{r.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
