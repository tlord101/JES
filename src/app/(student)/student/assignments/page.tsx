import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STUDENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getMyStudentRecord, listClassAssignments, type AssignmentItem } from '@/lib/data/portal';
import { formatDate } from '@/lib/format';
import type { SubmissionStatus } from '@/types/database';

export const metadata = { title: 'Assignments | JES Student Portal' };

type AssignmentStatus = SubmissionStatus | 'not-submitted';

const STATUS_TONES: Record<AssignmentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  submitted: 'bg-blue-100 text-blue-800',
  late: 'bg-orange-100 text-orange-800',
  graded: 'bg-green-100 text-green-800',
  returned: 'bg-purple-100 text-purple-800',
  'not-submitted': 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<AssignmentStatus, string> = {
  pending: 'Awaiting grading',
  submitted: 'Turned in',
  late: 'Turned in late',
  graded: 'Graded',
  returned: 'Returned',
  'not-submitted': 'Not submitted',
};

function isPending(status: AssignmentStatus): boolean {
  return status === 'not-submitted' || status === 'pending';
}

/** Earliest due date first so outstanding work rises to the top. */
function byDueDate(a: AssignmentItem, b: AssignmentItem): number {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}

export default async function StudentAssignmentsPage() {
  const user = await requireRole(STUDENT_PORTAL_ROLES);
  const record = await getMyStudentRecord(user.id);

  if (!record) {
    return (
      <div className="space-y-6 text-xs">
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No student record is linked to this account yet, so there are no assignments to show.
          Please contact the school office.
        </div>
      </div>
    );
  }

  const assignments = record.classId
    ? await listClassAssignments(record.classId, record.studentId)
    : [];

  const sorted = [...assignments].sort(byDueDate);
  const pending = sorted.filter((item) => isPending(item.submissionStatus));
  const turnedIn = sorted.filter(
    (item) => item.submissionStatus === 'submitted' || item.submissionStatus === 'late'
  );
  const graded = sorted.filter(
    (item) => item.submissionStatus === 'graded' || item.submissionStatus === 'returned'
  );

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Assignments</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Work published by your teachers for {record.className ?? 'your class'}, with the status
            of each of your submissions.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">
            {record.className ?? 'No class assigned'}
          </div>
          <div className="text-[11px] text-[var(--muted-text)]">{record.admissionNo}</div>
        </div>
      </div>

      {!record.classId ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          You have not been assigned to a class yet, so no assignments can be shown. Please contact
          the school office.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: 'Total Assignments',
                value: String(assignments.length),
                hint: 'Published for your class',
              },
              {
                label: 'To Do',
                value: String(pending.length),
                hint: 'Not yet turned in',
              },
              {
                label: 'Turned In',
                value: String(turnedIn.length),
                hint: 'Waiting to be graded',
              },
              {
                label: 'Graded',
                value: String(graded.length),
                hint: 'Marks released',
              },
            ].map((tile) => (
              <div key={tile.label} className="bg-white p-4 border border-[var(--border)] rounded">
                <div className="text-[10px] font-bold text-[var(--muted-text)]">{tile.label}</div>
                <div className="text-xl font-extrabold text-[var(--primary-dark)]">
                  {tile.value}
                </div>
                <div className="text-[10px] text-[var(--muted-text)]">{tile.hint}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
              All assignments
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                    <th className="p-3">Assignment</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Due date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {sorted.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--soft-bg)] align-top">
                      <td className="p-3">
                        <div className="font-bold text-[var(--primary-dark)]">{item.title}</div>
                        {item.description && (
                          <div className="text-[10px] text-[var(--muted-text)] line-clamp-2">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-[var(--muted-text)]">{item.subjectName ?? '—'}</td>
                      <td className="p-3 text-[var(--muted-text)]">
                        {item.dueDate ? formatDate(item.dueDate) : '—'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${STATUS_TONES[item.submissionStatus]}`}
                        >
                          {STATUS_LABELS[item.submissionStatus]}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-[var(--primary-dark)]">
                        {item.score === null ? '—' : `${item.score}/${item.maxScore}`}
                      </td>
                      <td className="p-3 text-[var(--muted-text)]">{item.feedback ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-wrap gap-4">
            <Link href="/student" className="font-bold text-[var(--primary)] hover:underline">
              ← Back to dashboard
            </Link>
            <Link
              href="/student/timetable"
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Weekly timetable
            </Link>
            <Link href="/student/results" className="font-bold text-[var(--primary)] hover:underline">
              My results
            </Link>
          </div>
        </>
      )}
    </div>
  );
}