import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Flash, EmptyState } from '@/lib/admin/ui';
import { setResultStatus } from '@/lib/admin/people-actions';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

export default async function ReviewResultsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('results')
    .select(
      `id, ca1_score, ca2_score, exam_score, total_score, grade, status,
       student:students(id, admission_no, profile:profiles(full_name)),
       subject:subjects(id, name, code),
       class:classes(id, name, arm),
       term:terms(id, name)`,
    )
    .eq('status', 'submitted')
    .order('updated_at')
    .limit(500);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Review results" />
        <div className="alert-danger">Failed to load queue: {error.message}</div>
      </div>
    );
  }

  const rows = (data ?? []) as unknown as {
    id: string;
    ca1_score: number;
    ca2_score: number;
    exam_score: number;
    total_score: number;
    grade: string | null;
    student: { admission_no: string; profile: { full_name: string } | null } | null;
    subject: { name: string; code: string | null } | null;
    class: { name: string; arm: string | null } | null;
    term: { name: string } | null;
  }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review queue"
        description="Submitted results awaiting approval. Approving makes them visible for publication."
        actions={
          <Link href="/admin/results" className="btn-secondary">
            All results
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      {rows.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          body="No results are waiting for review."
          action={
            <Link href="/admin/results" className="btn-secondary">
              Back to results
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
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-slate-900">
                    {r.student?.profile?.full_name ?? '—'}
                    <div className="font-mono text-xs text-slate-400">{r.student?.admission_no}</div>
                  </td>
                  <td>{r.subject?.name}</td>
                  <td>{r.class ? `${r.class.name}${r.class.arm ? ' ' + r.class.arm : ''}` : '—'}</td>
                  <td>{r.term?.name ?? '—'}</td>
                  <td className="text-right font-medium tabular-nums">{r.total_score}</td>
                  <td>{r.grade ?? '—'}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <form action={setResultStatus} className="inline-flex">
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="approved" />
                        <input type="hidden" name="path" value="/admin/results/review" />
                        <button type="submit" className="btn-primary">
                          Approve
                        </button>
                      </form>
                      <form action={setResultStatus} className="inline-flex">
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="draft" />
                        <input type="hidden" name="path" value="/admin/results/review" />
                        <button type="submit" className="btn-secondary">
                          Return to draft
                        </button>
                      </form>
                    </div>
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
