import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, StatusBadge, EmptyState } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

type StaffRow = {
  id: string;
  staff_no: string;
  position: string;
  department: string | null;
  status: string;
  photo_url: string | null;
  profile: { full_name: string; email: string; phone: string | null } | null;
};

export default async function AdminStaffPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : '';
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('staff')
    .select('id, staff_no, position, department, status, photo_url, profile:profiles(full_name, email, phone)')
    .order('staff_no')
    .limit(500);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Staff" />
        <div className="alert-danger">Failed to load staff: {error.message}</div>
      </div>
    );
  }

  let rows = (data ?? []) as unknown as StaffRow[];
  if (q) {
    rows = rows.filter(
      (s) =>
        (s.profile?.full_name ?? '').toLowerCase().includes(q) ||
        s.staff_no.toLowerCase().includes(q) ||
        (s.department ?? '').toLowerCase().includes(q) ||
        s.position.toLowerCase().includes(q),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Teaching and non-teaching staff directory."
        actions={
          <Link href="/admin/users/new" className="btn-primary">
            Add staff member
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form className="flex gap-2" action="/admin/staff">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, staff no or department..."
          className="input-field max-w-md"
        />
        <button type="submit" className="btn-secondary">
          Search
        </button>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title={q ? 'No matches' : 'No staff yet'}
          body={q ? 'Try a different search.' : 'Create staff accounts under Users.'}
          action={
            <Link href="/admin/users/new" className="btn-primary">
              Add staff member
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Staff no</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-xs">{s.staff_no}</td>
                  <td className="font-medium text-slate-900">{s.profile?.full_name ?? '—'}</td>
                  <td>{s.position}</td>
                  <td>{s.department || '—'}</td>
                  <td>{s.profile?.email ?? '—'}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="text-right">
                    <Link href={`/admin/staff/${s.id}`} className="text-sm text-primary-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
