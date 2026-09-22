import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STUDENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getCurrentTerm, listTerms } from '@/lib/data/academics';
import {
  averageScore,
  getMyStudentRecord,
  listPublishedResults,
  listStudentReportCards,
  performanceBand,
} from '@/lib/data/portal';
import { titleCase } from '@/lib/format';

export const metadata = { title: 'My Results | JES Student Portal' };

type SearchParams = Promise<{ termId?: string }>;

export default async function StudentResultsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireRole(STUDENT_PORTAL_ROLES);
  const params = await searchParams;

  const record = await getMyStudentRecord(user.id);

  if (!record) {
    return (
      <div className="space-y-6 text-xs">
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No student record is linked to this account yet, so there are no results to show. Please
          contact the school office.
        </div>
      </div>
    );
  }

  const [terms, currentTerm] = await Promise.all([listTerms(), getCurrentTerm()]);
  const selectedTerm =
    terms.find((term) => term.id === params.termId) ?? currentTerm ?? terms[0] ?? null;

  const [results, reportCards] = await Promise.all([
    listPublishedResults(record.studentId, selectedTerm?.id),
    listStudentReportCards(record.studentId),
  ]);

  const average = averageScore(results);
  const termCards = selectedTerm
    ? reportCards.filter((item) => item.termId === selectedTerm.id)
    : reportCards;

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">My Results</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Only results approved and published by the school appear here — drafts are never shown.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">
            {selectedTerm ? titleCase(selectedTerm.name) : 'No term set up'}
          </div>
          <div className="text-[11px] text-[var(--muted-text)]">
            {record.className ?? 'No class assigned'} • {record.admissionNo}
          </div>
        </div>
      </div>

      <form
        method="get"
        className="bg-white p-4 border border-[var(--border)] rounded grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
      >
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="termId">
            Term
          </label>
          <select
            id="termId"
            name="termId"
            defaultValue={selectedTerm?.id ?? ''}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {terms.length === 0 && <option value="">No terms set up</option>}
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {titleCase(term.name)}
                {term.isCurrent ? ' (current)' : ''}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
        >
          Load results
        </button>
      </form>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Subjects Published',
            value: String(results.length),
            hint: selectedTerm ? titleCase(selectedTerm.name) : 'All terms',
          },
          {
            label: 'Average Score',
            value: average === null ? '—' : `${average}%`,
            hint: performanceBand(average),
          },
          {
            label: 'Best Score',
            value: results.length
              ? `${Math.max(...results.map((result) => result.totalScore))}/100`
              : '—',
            hint: 'Highest subject total',
          },
          {
            label: 'Report Cards',
            value: String(termCards.length),
            hint: 'Published by the school',
          },
        ].map((tile) => (
          <div key={tile.label} className="bg-white p-4 border border-[var(--border)] rounded">
            <div className="text-[10px] font-bold text-[var(--muted-text)]">{tile.label}</div>
            <div className="text-xl font-extrabold text-[var(--primary-dark)]">{tile.value}</div>
            <div className="text-[10px] text-[var(--muted-text)]">{tile.hint}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
          Broadsheet — {record.className ?? 'No class assigned'}
        </div>

        {results.length === 0 ? (
          <p className="p-6 text-[var(--muted-text)]">
            No published results for this selection yet. Teachers record scores first; the
            administration publishes them once approved.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">CA1 (20)</th>
                  <th className="p-3 text-center">CA2 (20)</th>
                  <th className="p-3 text-center">Exam (60)</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3">Remark</th>
                  <th className="p-3">Term</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-[var(--soft-bg)]">
                    <td className="p-3">
                      <div className="font-bold text-[var(--primary-dark)]">
                        {result.subjectName}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--muted-text)]">
                        {result.subjectCode}
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono">{result.ca1Score}</td>
                    <td className="p-3 text-center font-mono">{result.ca2Score}</td>
                    <td className="p-3 text-center font-mono">{result.examScore}</td>
                    <td className="p-3 text-center font-mono font-bold text-[var(--primary-dark)]">
                      {result.totalScore}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded">
                        {result.grade ?? '—'}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--muted-text)]">{result.remark ?? '—'}</td>
                    <td className="p-3 text-[var(--muted-text)]">
                      {result.termName ? titleCase(result.termName) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
          Published Report Cards
        </div>

        {termCards.length === 0 ? (
          <p className="p-6 text-[var(--muted-text)]">
            No report card has been published for you yet. Report cards appear here at the end of
            each term once the school publishes them.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {termCards.map((card) => (
              <div key={card.id} className="p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-[var(--primary-dark)]">
                    {titleCase(card.termName)} report card
                  </p>
                  <span className="text-[10px] font-bold text-green-700 uppercase">Published</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    {
                      label: 'Average',
                      value: card.averageScore === null ? '—' : `${card.averageScore}%`,
                    },
                    {
                      label: 'Position',
                      value: `${card.positionInClass ?? '—'}${
                        card.classSize ? ` of ${card.classSize}` : ''
                      }`,
                    },
                    { label: 'Subjects', value: String(card.subjectsOffered ?? '—') },
                    {
                      label: 'Attendance',
                      value: `${card.daysPresent ?? 0} of ${card.daysSchoolOpen ?? 0} days`,
                    },
                  ].map((tile) => (
                    <div
                      key={tile.label}
                      className="p-2 bg-[var(--soft-bg)] border border-[var(--border)] rounded"
                    >
                      <div className="text-[10px] font-bold text-[var(--muted-text)] uppercase">
                        {tile.label}
                      </div>
                      <div className="font-bold text-[var(--primary-dark)]">{tile.value}</div>
                    </div>
                  ))}
                </div>
                {card.classTeacherRemark && (
                  <p className="text-[11px] text-[var(--muted-text)]">
                    <span className="font-bold text-[var(--text)]">Class teacher:</span>{' '}
                    {card.classTeacherRemark}
                  </p>
                )}
                {card.principalRemark && (
                  <p className="text-[11px] text-[var(--muted-text)]">
                    <span className="font-bold text-[var(--text)]">Principal:</span>{' '}
                    {card.principalRemark}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-wrap gap-4">
        <Link href="/student" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to dashboard
        </Link>
        <Link href="/student/timetable" className="font-bold text-[var(--primary)] hover:underline">
          Weekly timetable
        </Link>
        <Link
          href="/student/attendance"
          className="font-bold text-[var(--primary)] hover:underline"
        >
          Attendance history
        </Link>
        <Link
          href="/student/assignments"
          className="font-bold text-[var(--primary)] hover:underline"
        >
          My assignments
        </Link>
      </div>
    </div>
  );
}
