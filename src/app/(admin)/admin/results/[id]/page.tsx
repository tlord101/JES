import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth/session';
import { ADMIN_PORTAL_ROLES } from '@/lib/auth/roles';
import { createClient } from '@/lib/supabase/server';
import { StatusBadge, EmptyState } from '@/lib/admin/ui';
import { PrintButton } from './PrintButton';

export const dynamic = 'force-dynamic';

export default async function PrintableReportSheetPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(ADMIN_PORTAL_ROLES);
  const { id } = await params;
  const supabase = await createClient();

  const { data: result } = await supabase
    .from('results')
    .select(
      `id, ca1_score, ca2_score, exam_score, ca_score, total_score, grade, remark, position_in_class, status,
       approved_at, created_at,
       student:students(id, admission_no, date_of_birth, gender, profile:profiles(full_name)),
       subject:subjects(id, name, code),
       class:classes(id, name, arm),
       term:terms(id, name, start_date, end_date, year:academic_years(name))`,
    )
    .eq('id', id)
    .maybeSingle();

  if (!result) notFound();

  const r = result as unknown as {
    id: string;
    ca1_score: number;
    ca2_score: number;
    exam_score: number;
    ca_score: number;
    total_score: number;
    grade: string | null;
    remark: string | null;
    position_in_class: number | null;
    status: string;
    approved_at: string | null;
    student: {
      id: string;
      admission_no: string;
      gender: string | null;
      profile: { full_name: string } | null;
    } | null;
    subject: { id: string; name: string; code: string | null } | null;
    class: { id: string; name: string; arm: string | null } | null;
    term: { id: string; name: string; year: { name: string } | null } | null;
  };

  const { data: siblings } = await supabase
    .from('results')
    .select('id, total_score, grade, subject:subjects(name, code)')
    .eq('student_id', r.student?.id ?? '')
    .eq('term_id', r.term?.id ?? '')
    .order('total_score', { ascending: false });

  const siblingRows = ((siblings ?? []) as unknown as {
    id: string;
    total_score: number;
    grade: string | null;
    subject: { name: string; code: string | null } | null;
  }[]) ?? [];

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Result sheet</h1>
          <p className="text-sm text-slate-500">Single-subject result with term context.</p>
        </div>
        <PrintButton />
      </div>

      <section className="card print:border-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Student</div>
            <div className="font-semibold text-slate-900">{r.student?.profile?.full_name ?? '—'}</div>
            <div className="font-mono text-sm text-slate-500">{r.student?.admission_no}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Class</div>
            <div className="font-semibold text-slate-900">
              {r.class ? `${r.class.name}${r.class.arm ? ' ' + r.class.arm : ''}` : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Term</div>
            <div className="font-semibold text-slate-900">
              {r.term ? `${r.term.year?.name ? r.term.year.name + ' · ' : ''}${r.term.name}` : '—'}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Status</div>
            <div className="mt-1">
              <StatusBadge status={r.status} />
            </div>
          </div>
        </div>
      </section>

      <section className="card print:border-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {r.subject?.name}
            {r.subject?.code ? <span className="text-sm font-normal text-slate-400"> ({r.subject.code})</span> : null}
          </h2>
          {r.grade ? (
            <span className="rounded-full bg-primary-50 px-4 py-1 text-xl font-bold text-primary-700">{r.grade}</span>
          ) : null}
        </div>
        <table className="table mt-4">
          <tbody>
            <tr>
              <td>Continuous Assessment 1</td>
              <td className="text-right font-medium tabular-nums">{r.ca1_score} / 20</td>
            </tr>
            <tr>
              <td>Continuous Assessment 2</td>
              <td className="text-right font-medium tabular-nums">{r.ca2_score} / 20</td>
            </tr>
            <tr>
              <td>CA total</td>
              <td className="text-right font-medium tabular-nums">{r.ca_score} / 40</td>
            </tr>
            <tr>
              <td>Examination</td>
              <td className="text-right font-medium tabular-nums">{r.exam_score} / 60</td>
            </tr>
            <tr className="border-t-2 border-slate-200">
              <td className="font-semibold">Total</td>
              <td className="text-right text-lg font-bold tabular-nums">{r.total_score} / 100</td>
            </tr>
            <tr>
              <td>Position in class</td>
              <td className="text-right font-medium tabular-nums">
                {r.position_in_class ? `${r.position_in_class}${ordinal(r.position_in_class)}` : '—'}
              </td>
            </tr>
            {r.remark ? (
              <tr>
                <td>Remark</td>
                <td className="text-right">{r.remark}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="space-y-3 print:border-0">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">All subjects this term</h2>
        {siblingRows.length <= 1 ? (
          <EmptyState message="No other results recorded for this student in this term." />
        ) : (
          <div className="card overflow-x-auto p-0 print:border-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th className="text-right">Total</th>
                  <th>Grade</th>
                  <th className="text-right">This result</th>
                </tr>
              </thead>
              <tbody>
                {siblingRows.map((s) => (
                  <tr key={s.id} className={s.id === r.id ? 'bg-primary-50' : ''}>
                    <td>
                      {s.subject?.name}
                      {s.subject?.code ? <span className="text-xs text-slate-400"> ({s.subject.code})</span> : null}
                    </td>
                    <td className="text-right tabular-nums">{s.total_score}</td>
                    <td>{s.grade ?? '—'}</td>
                    <td className="text-right">{s.id === r.id ? '← current' : ''}</td>
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

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return 'th';
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
