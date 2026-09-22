import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STAFF_PORTAL_ROLES } from '@/lib/auth/roles';
import {
  classAverage,
  getCurrentTerm,
  getGradebook,
  listSubjects,
  listTeacherClasses,
  listTerms,
} from '@/lib/data/academics';
import { termLabel } from '@/lib/format';
import GradebookForm from './GradebookForm';

export const metadata = { title: 'Results Entry | JES Staff' };

type SearchParams = Promise<{ classId?: string; subjectId?: string; termId?: string }>;

export default async function StaffResultsEntryPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireRole(STAFF_PORTAL_ROLES);
  const params = await searchParams;

  const [classes, subjects, terms, currentTerm] = await Promise.all([
    listTeacherClasses(user.id),
    listSubjects(),
    listTerms(),
    getCurrentTerm(),
  ]);

  const selectedClass = classes.find((item) => item.id === params.classId) ?? classes[0] ?? null;
  const selectedSubject =
    subjects.find((item) => item.id === params.subjectId) ?? subjects[0] ?? null;
  const selectedTerm =
    terms.find((item) => item.id === params.termId) ?? currentTerm ?? terms[0] ?? null;

  const entries =
    selectedClass && selectedSubject && selectedTerm
      ? await getGradebook(selectedClass.id, selectedSubject.id, selectedTerm.id)
      : [];

  const average = classAverage(entries);
  const canEnter = Boolean(selectedClass && selectedSubject && selectedTerm);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Continuous Assessment &amp; Results Entry</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Record CA1 (max 20), CA2 (max 20) and the examination score (max 60). Grades and remarks are
            calculated automatically by the database, then submitted for review.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">{termLabel(selectedTerm)}</div>
          <div className="text-[11px] text-[var(--muted-text)]">Class average: {average}</div>
        </div>
      </div>

      <form
        method="get"
        className="bg-white p-4 border border-[var(--border)] rounded grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="block font-semibold mb-1" htmlFor="classId">
            Class
          </label>
          <select
            id="classId"
            name="classId"
            defaultValue={selectedClass?.id ?? ''}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {classes.length === 0 && <option value="">No classes assigned</option>}
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="subjectId">
            Subject
          </label>
          <select
            id="subjectId"
            name="subjectId"
            defaultValue={selectedSubject?.id ?? ''}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {subjects.length === 0 && <option value="">No subjects yet</option>}
            {subjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="termId">
            Term
          </label>
          <select
            id="termId"
            name="termId"
            defaultValue={selectedTerm?.id ?? ''}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {terms.length === 0 && <option value="">No terms yet</option>}
            {terms.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.isCurrent ? ' (current)' : ''}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
        >
          Load gradebook
        </button>
      </form>

      {!canEnter ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          Select a class, subject and term to open the gradebook. If the lists are empty an administrator
          still needs to set up classes, subjects and terms.
        </div>
      ) : (
        <GradebookForm
          classId={selectedClass!.id}
          className={selectedClass!.name}
          subjectId={selectedSubject!.id}
          subjectName={selectedSubject!.name}
          termId={selectedTerm!.id}
          termName={selectedTerm!.name}
          entries={entries}
        />
      )}

      <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-wrap gap-4">
        <Link href="/staff/my-classes" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to my classes
        </Link>
        <Link href="/staff/attendance" className="font-bold text-[var(--primary)] hover:underline">
          Daily attendance register
        </Link>
      </div>
    </div>
  );
}
