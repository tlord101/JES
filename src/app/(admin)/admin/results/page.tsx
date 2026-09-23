import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import type { ResultStatus } from '@/types/database';
import { PageHeader, Flash, StatusBadge, EmptyState } from '@/lib/admin/ui';

export const dynamic = 'force-dynamic';

type SP = Record<string, string | string[] | undefined>;

const STATUSES = ['draft', 'submitted', 'approved', 'published'] as const;

export default async function AdminResultsPage({ searchParams }: { searchParams: Promise<SP> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const sp = await searchParams;
  const status = typeof sp.status === 'string' && sp.status ? sp.status : '';
  const termId = typeof sp.term === 'string' && sp.term ? sp.term : '';
  const supabase = await createClient();

  const [{ data, error }, { data: terms }] = await Promise.all([
    (async () => {
      let q = supabase
        .from('results')
        .select(
          `id, ca1_score, ca2_score, exam_score, total_score, grade, status,
           student:students(id, admission_no, profile:profiles(full_name)),
           subject:subjects(id, name, code),
           class:classes(id, name, arm),
           term:terms(id, name)`,
        )
        .order('updated_at', { ascending: false })
        .limit(200);
      if (status) q = q.eq('status', status as NonNullable<ResultStatus>);
      if (termId) q = q.eq('term_id', termId);
      return q;
    })(),
    supabase.from('terms').select('id, name').order('start_date', { ascending: false }).limit(20),
  ]);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Results" />
        <div className="alert-danger">Failed to load results: {error.message}</div>
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
    status: string;
    student: { id: string; admission_no: string; profile: { full_name: string } | null } | null;
    subject: { id: string; name: string; code: string | null } | null;
    class: { id: string; name: string; arm: string | null } | null;
    term: { id: string; name: string } | null;
  }[];

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => r.status === s).length;
    return acc;
  }, {});

  const hrefFor = (s?: string) => {
    const params = new URLSearchParams();
    if (s) params.set('status', s);
    if (termId) params.set('term', termId);
    const qs = params.toString();
    return `/admin/results${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results"
        description="Approve and publish exam results — teachers submit from the Staff portal."
        actions={
          <Link href="/admin/results/review" className="btn-primary">
            Review queue
          </Link>
        }
      />
      <Flash ok={sp.ok} err={sp.err} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <a
            href={hrefFor()}
            className={`rounded-full px-3 py-1 ${!status ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All ({rows.length})
          </a>
          {STATUSES.map((s) => (
            <a
              key={s}
              href={hrefFor(s)}
              className={`rounded-full px-3 py-1 capitalize ${status === s ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {s} ({counts[s] ?? 0})
            </a>
          ))}
        </div>

        <form action="/admin/results" className="ml-auto">
          {status && <input type="hidden" name="status" value={status} />}
          <select name="term" defaultValue={termId} className="input-field max-w-[16rem]">
            <option value="">All terms</option>
            {(terms ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No results yet"
          body="Results appear here once teachers enter scores in the Staff portal."
          action={
            <Link href="/staff/results-entry" className="btn-primary">
              Enter results
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
                <th className="text-right">CA1 /20</th>
                <th className="text-right">CA2 /20</th>
                <th className="text-right">Exam /60</th>
                <th className="text-right">Total /100</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/students/${r.student?.id}`} className="font-medium text-slate-900 hover:underline">
                      {r.student?.profile?.full_name ?? '—'}
                    </Link>
                    <div className="font-mono text-xs text-slate-400">{r.student?.admission_no}</div>
                  </td>
                  <td>
                    {r.subject?.name}
                    {r.subject?.code ? <span className="text-xs text-slate-400"> ({r.subject.code})</span> : null}
                  </td>
                  <td>
                    {r.class ? `${r.class.name}${r.class.arm ? ' ' + r.class.arm : ''}` : '—'}
                  </td>
                  <td>{r.term?.name ?? '—'}</td>
                  <td className="text-right tabular-nums">{r.ca1_score}</td>
                  <td className="text-right tabular-nums">{r.ca2_score}</td>
                  <td className="text-right tabular-nums">{r.exam_score}</td>
                  <td className="text-right font-medium tabular-nums">{r.total_score}</td>
                  <td>{r.grade ?? '—'}</td>
                  <td>
                    <StatusBadge status={r.status} />
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
