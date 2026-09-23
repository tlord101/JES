import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, StatusBadge, EmptyState } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

type StudentRow = {
  id: string;
  admission_no: string;
  gender: string | null;
  status: string;
  class: { name: string; arm: string | null } | null;
  profile: { full_name: string; email: string } | null;
};

export default async function AdminStudentsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : '';
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('students')
    .select(
      'id, admission_no, gender, status, class:classes(name, arm), profile:profiles(full_name, email)',
    )
    .order('admission_no')
    .limit(500);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Students" />
        <div className="alert-danger">Failed to load students: {error.message}</div>
      </div>
    );
  }

  let rows = (data ?? []) as unknown as StudentRow[];
  if (q) {
    rows = rows.filter(
      (s) =>
        (s.profile?.full_name ?? '').toLowerCase().includes(q) ||
        s.admission_no.toLowerCase().includes(q) ||
        (s.profile?.email ?? '').toLowerCase().includes(q),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="All enrolled students, live from Supabase."
        actions={
          <Link href="/admin/enrollments" className="btn-secondary">
            Manage enrolments
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <form className="flex gap-2" action="/admin/students">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, admission no or email..."
          className="input-field max-w-md"
        />
        <button type="submit" className="btn-secondary">
          Search
        </button>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title={q ? 'No matches' : 'No students yet'}
          body={q ? 'Try a different search.' : 'Create accounts for students under Users.'}
          action={
            <Link href="/admin/users/new" className="btn-primary">
              Add student
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Adm. no</th>
                <th>Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-xs">{s.admission_no}</td>
                  <td className="font-medium text-slate-900">{s.profile?.full_name ?? '—'}</td>
                  <td>
                    {s.class ? `${s.class.name}${s.class.arm ? ' ' + s.class.arm : ''}` : '—'}
                  </td>
                  <td>{s.gender ?? '—'}</td>
                  <td>{s.profile?.email ?? '—'}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
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
