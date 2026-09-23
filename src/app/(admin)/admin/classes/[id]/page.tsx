import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, Badge } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AdminClassDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SP>;
}) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: cls }, { data: students, error: rosterError }, { data: subjects }] = await Promise.all([
    supabase
      .from('classes')
      .select('id, name, level, arm, capacity, room, is_active, class_teacher:profiles(full_name)')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('students')
      .select('id, admission_no, status, profile:profiles(full_name)')
      .eq('class_id', id)
      .order('admission_no')
      .limit(1000),
    supabase
      .from('class_subjects')
      .select('id, subject:subjects(id, name, code), teacher:profiles(full_name)')
      .eq('class_id', id),
  ]);

  if (!cls) notFound();

  const klass = cls as unknown as {
    id: string;
    name: string;
    level: string;
    arm: string | null;
    capacity: number;
    room: string | null;
    is_active: boolean;
    class_teacher: { full_name: string } | null;
  };
  const roster = ((students ?? []) as unknown as {
    id: string;
    admission_no: string;
    status: string;
    profile: { full_name: string } | null;
  }[]) ?? [];
  const subjectRows = ((subjects ?? []) as unknown as {
    id: string;
    subject: { id: string; name: string; code: string | null } | null;
    teacher: { full_name: string } | null;
  }[]) ?? [];

  const active = roster.filter((s) => s.status === 'active').length;
  const full = active >= klass.capacity;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${klass.name}${klass.arm ? ' ' + klass.arm : ''}`}
        description={`${klass.level.replace('_', ' ')}${klass.room ? ` · Room ${klass.room}` : ''} · Capacity ${klass.capacity}`}
        actions={
          <Link href="/admin/classes" className="btn-secondary">
            ← All classes
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Class teacher</div>
          <div className="mt-1 font-semibold text-slate-900">{klass.class_teacher?.full_name ?? 'Not assigned'}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Students</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{roster.length}</div>
          <div className="text-xs text-slate-400">{active} active</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Subjects</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{subjectRows.length}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Status</div>
          <div className="mt-2 flex gap-2">
            <Badge tone={klass.is_active ? 'success' : 'neutral'}>{klass.is_active ? 'Active' : 'Inactive'}</Badge>
            <Badge tone={full ? 'warning' : 'success'}>{full ? 'At capacity' : 'Space available'}</Badge>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Subjects offered</h2>
        {subjectRows.length === 0 ? (
          <EmptyState message="No subjects assigned to this class yet." cta={{ href: '/admin/subjects', label: 'Manage subjects' }} />
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {subjectRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/subjects/${row.subject?.id}`} className="font-medium text-slate-900 hover:underline">
                        {row.subject?.name ?? '—'}
                      </Link>
                    </td>
                    <td className="font-mono text-sm text-slate-500">{row.subject?.code ?? '—'}</td>
                    <td>{row.teacher?.full_name ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Class roster ({roster.length})</h2>
        {rosterError ? (
          <div className="alert-danger">{rosterError.message}</div>
        ) : roster.length === 0 ? (
          <EmptyState message="No students in this class yet." cta={{ href: '/admin/enrollments', label: 'Enroll students' }} />
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Admission no.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((s, i) => (
                  <tr key={s.id}>
                    <td className="text-slate-400">{i + 1}</td>
                    <td>
                      <Link href={`/admin/students/${s.id}`} className="font-medium text-slate-900 hover:underline">
                        {s.profile?.full_name ?? '—'}
                      </Link>
                    </td>
                    <td className="font-mono text-sm text-slate-500">{s.admission_no}</td>
                    <td>
                      <Badge tone={s.status === 'active' ? 'success' : 'neutral'}>{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
