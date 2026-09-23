import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, Badge } from '@/lib/admin/ui';
import { updateStudent } from '@/lib/admin/people-actions';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function EnrollmentsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: students, error }, { data: classes }] = await Promise.all([
    supabase
      .from('students')
      .select('id, admission_no, class_id, status, profile:profiles(full_name)')
      .order('admission_no')
      .limit(2000),
    supabase.from('classes').select('id, name, arm, level').order('level').order('name'),
  ]);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Enrollments" />
        <div className="alert-danger">Failed to load students: {error.message}</div>
      </div>
    );
  }

  type StudentRow = {
    id: string;
    admission_no: string;
    class_id: string | null;
    status: string;
    profile: { full_name: string } | null;
  };
  const studentRows = (students ?? []) as unknown as StudentRow[];
  const classRows = (classes ?? []) as unknown as { id: string; name: string; arm: string | null; level: number }[];

  const grouped = new Map<string, StudentRow[]>();
  for (const s of studentRows) {
    const key = s.class_id ?? 'unassigned';
    const list = grouped.get(key) ?? [];
    list.push(s);
    grouped.set(key, list);
  }
  const classLabel = (id: string) => {
    const c = classRows.find((x) => x.id === id);
    return c ? `${c.name}${c.arm ? ' ' + c.arm : ''}` : 'Unknown class';
  };

  const orderKeys = [
    ...classRows.map((c) => c.id),
    ...(grouped.has('unassigned') ? ['unassigned'] : []),
  ].filter((k, i, arr) => arr.indexOf(k) === i && grouped.has(k));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrollments"
        description="Every student grouped by class. Move students between classes below — assignments save instantly."
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="flex flex-wrap gap-2 text-sm">
        {orderKeys.map((key) => (
          <a
            key={key}
            href={`#${key}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200"
          >
            {key === 'unassigned' ? 'Unassigned' : classLabel(key)} ({grouped.get(key)!.length})
          </a>
        ))}
      </div>

      {studentRows.length === 0 ? (
        <EmptyState message="No students enrolled yet." />
      ) : (
        orderKeys.map((key) => {
          const list = grouped.get(key)!;
          return (
            <section key={key} id={key} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {key === 'unassigned' ? 'Unassigned' : classLabel(key)} · {list.length} student{list.length === 1 ? '' : 's'}
              </h2>
              <div className="card overflow-x-auto p-0">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Admission no.</th>
                      <th>Status</th>
                      <th className="text-right">Move to class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((s) => (
                      <tr key={s.id}>
                        <td className="font-medium text-slate-900">{s.profile?.full_name ?? '—'}</td>
                        <td className="font-mono text-sm text-slate-500">{s.admission_no}</td>
                        <td>
                          <StatusPill status={s.status} />
                        </td>
                        <td>
                          <form action={updateStudent} className="flex justify-end gap-2">
                            <input type="hidden" name="id" value={s.id} />
                            <input type="hidden" name="path" value="/admin/enrollments" />
                            <select name="class_id" defaultValue={s.class_id ?? ''} className="input-field max-w-[14rem]">
                              <option value="">Unassigned</option>
                              {classRows.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                  {c.arm ? ' ' + c.arm : ''}
                                </option>
                              ))}
                            </select>
                            <button type="submit" className="btn-secondary">
                              Save
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = status === 'active' ? 'success' : status === 'graduated' ? 'info' : status === 'suspended' ? 'error' : 'neutral';
  return <Badge tone={tone}>{status}</Badge>;
}
