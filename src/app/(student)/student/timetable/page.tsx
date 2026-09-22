import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STUDENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getCurrentTerm, listTerms } from '@/lib/data/academics';
import { getMyStudentRecord, listClassTimetable } from '@/lib/data/portal';
import { formatTime, titleCase, weekdayLabel } from '@/lib/format';

export const metadata = { title: 'My Timetable | JES Student Portal' };

const WEEK = [1, 2, 3, 4, 5];

type SearchParams = Promise<{ termId?: string }>;

export default async function StudentTimetablePage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireRole(STUDENT_PORTAL_ROLES);
  const params = await searchParams;

  const record = await getMyStudentRecord(user.id);

  if (!record) {
    return (
      <div className="space-y-6 text-xs">
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No student record is linked to this account yet, so there is no timetable to show. Please
          contact the school office.
        </div>
      </div>
    );
  }

  const [terms, currentTerm] = await Promise.all([listTerms(), getCurrentTerm()]);
  const selectedTerm =
    terms.find((term) => term.id === params.termId) ?? currentTerm ?? terms[0] ?? null;
  const timetable = await listClassTimetable(record.classId ?? '', selectedTerm?.id);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Weekly Timetable</h1>
          <p className="text-xs text-[var(--muted-text)]">
            {record.className ?? 'No class assigned'} • lessons run Monday to Friday.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">
            {selectedTerm ? titleCase(selectedTerm.name) : 'No term set up'}
          </div>
          <div className="text-[11px] text-[var(--muted-text)]">{timetable.length} periods</div>
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
          Load timetable
        </button>
      </form>

      {timetable.length === 0 ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No lessons have been published for this class and term yet. The school office publishes the
          timetable at the start of each term.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {WEEK.map((day) => {
            const lessons = timetable.filter((lesson) => lesson.dayOfWeek === day);
            return (
              <div
                key={day}
                className="bg-white border border-[var(--border)] rounded overflow-hidden"
              >
                <div className="p-3 bg-[var(--soft-bg)] border-b border-[var(--border)] flex items-center justify-between">
                  <span className="font-bold text-[var(--primary-dark)]">{weekdayLabel(day)}</span>
                  <span className="text-[10px] text-[var(--muted-text)]">
                    {lessons.length} period{lessons.length === 1 ? '' : 's'}
                  </span>
                </div>
                {lessons.length === 0 ? (
                  <p className="p-3 text-[var(--muted-text)]">No lessons scheduled.</p>
                ) : (
                  <div className="p-3 space-y-2">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-2 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1"
                      >
                        <div className="font-bold text-[var(--primary-dark)]">
                          {lesson.subjectName}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--primary)]">
                          {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                        </div>
                        <div className="text-[10px] text-[var(--muted-text)]">
                          {lesson.teacherName ?? 'Teacher to be assigned'}
                        </div>
                        {lesson.room && (
                          <div className="text-[10px] text-[var(--muted-text)]">
                            Room {lesson.room}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-wrap gap-4">
        <Link href="/student" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to dashboard
        </Link>
        <Link href="/student/assignments" className="font-bold text-[var(--primary)] hover:underline">
          My assignments
        </Link>
        <Link href="/student/attendance" className="font-bold text-[var(--primary)] hover:underline">
          My attendance
        </Link>
      </div>
    </div>
  );
}
