import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, Badge } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function AdminSubjectDetailPage({
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

  const [{ data: subject }, { data: offerings }, { data: staffLinks }] = await Promise.all([
    supabase.from('subjects').select('id, code, name, department, level, description, is_active').eq('id', id).maybeSingle(),
    supabase
      .from('class_subjects')
      .select('id, class:classes(id, name, arm), teacher:profiles(full_name)')
      .eq('subject_id', id),
    supabase
      .from('staff_subjects')
      .select('staff:staff(id, staff_no, position, profile:profiles(full_name))')
      .eq('subject_id', id),
  ]);

  if (!subject) notFound();

  const sub = subject as unknown as {
    id: string;
    code: string;
    name: string;
    department: string | null;
    level: string | null;
    description: string | null;
    is_active: boolean;
  };
  const classRows = ((offerings ?? []) as unknown as {
    id: string;
    class: { id: string; name: string; arm: string | null } | null;
    teacher: { full_name: string } | null;
  }[]) ?? [];
  const staffRows = ((staffLinks ?? []) as unknown as {
    staff: { id: string; staff_no: string; position: string; profile: { full_name: string } | null } | null;
  }[]) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={sub.name}
        description={`${sub.code}${sub.department ? ` · ${sub.department}` : ''}${sub.level ? ` · ${sub.level.replace('_', ' ')}` : ''}`}
        actions={
          <Link href="/admin/subjects" className="btn-secondary">
            ← All subjects
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Status</div>
          <div className="mt-2">
            <Badge tone={sub.is_active ? 'success' : 'neutral'}>{sub.is_active ? 'Active' : 'Inactive'}</Badge>
          </div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Classes offering</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{classRows.length}</div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-400">Assigned staff</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{staffRows.length}</div>
        </div>
      </div>

      {sub.description ? (
        <div className="card text-sm text-slate-600">{sub.description}</div>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Offered to classes</h2>
        {classRows.length === 0 ? (
          <EmptyState message="Not assigned to any class yet." cta={{ href: '/admin/classes', label: 'Manage classes' }} />
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {classRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link href={`/admin/classes/${row.class?.id}`} className="font-medium text-slate-900 hover:underline">
                        {row.class ? `${row.class.name}${row.class.arm ? ' ' + row.class.arm : ''}` : '—'}
                      </Link>
                    </td>
                    <td>{row.teacher?.full_name ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Assigned staff</h2>
        {staffRows.length === 0 ? (
          <EmptyState message="No staff assigned to this subject." cta={{ href: '/admin/staff', label: 'View staff' }} />
        ) : (
          <div className="card divide-y divide-slate-100">
            {staffRows
              .map((r) => r.staff)
              .filter(Boolean)
              .map((s) => (
                <Link key={s!.id} href={`/admin/staff/${s!.id}`} className="flex items-center justify-between py-3 hover:bg-slate-50">
                  <span className="font-medium text-slate-900">{s!.profile?.full_name ?? '—'}</span>
                  <span className="text-sm text-slate-500">
                    {s!.position} · {s!.staff_no}
                  </span>
                </Link>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
