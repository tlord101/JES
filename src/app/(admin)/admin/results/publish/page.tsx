import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState, StatusBadge } from '@/lib/admin/ui';
import { setResultStatus } from '@/lib/admin/people-actions';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function PublishResultsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('results')
    .select(
      `id, total_score, grade, status,
       student:students(id, admission_no, profile:profiles(full_name)),
       subject:subjects(id, name),
       class:classes(id, name, arm),
       term:terms(id, name)`,
    )
    .in('status', ['approved', 'published'])
    .order('updated_at', { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Publish results" />
        <div className="alert-danger">Failed to load results: {error.message}</div>
      </div>
    );
  }

  const rows = (data ?? []) as unknown as {
    id: string;
    total_score: number;
    grade: string | null;
    status: string;
    student: { admission_no: string; profile: { full_name: string } | null } | null;
    subject: { name: string } | null;
    class: { name: string; arm: string | null } | null;
    term: { name: string } | null;
  }[];

  const ready = rows.filter((r) => r.status === 'approved');
  const live = rows.filter((r) => r.status === 'published');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publish results"
        description={`${ready.length} approved waiting to go live · ${live.length} already visible to parents and students.`}
        actions={
          <Link href="/admin/results" className="btn-secondary">
            All results
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      {rows.length === 0 ? (
        <EmptyState
          title="Nothing to publish"
          body="Approve results first, then publish them here."
          action={
            <Link href="/admin/results/approve" className="btn-primary">
              Go to approvals
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Term</th>
                <th className="text-right">Total</th>
                <th>Grade</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-slate-900">{r.student?.profile?.full_name ?? '—'}</td>
                  <td>{r.subject?.name}</td>
                  <td>{r.class ? `${r.class.name}${r.class.arm ? ' ' + r.class.arm : ''}` : '—'}</td>
                  <td>{r.term?.name ?? '—'}</td>
                  <td className="text-right font-medium tabular-nums">{r.total_score}</td>
                  <td>{r.grade ?? '—'}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-right">
                    {r.status === 'approved' ? (
                      <form action={setResultStatus} className="inline-flex">
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="published" />
                        <input type="hidden" name="path" value="/admin/results/publish" />
                        <button type="submit" className="btn-primary">
                          Publish
                        </button>
                      </form>
                    ) : (
                      <span className="text-sm text-slate-400">Live</span>
                    )}
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
