import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { PARENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getStudentAttendance, listMyChildren } from '@/lib/data/portal';
import { formatDate, titleCase } from '@/lib/format';
import type { AttendanceStatus } from '@/types/database';

export const metadata = { title: 'Attendance | JES Parent Portal' };

const STATUS_TONES: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-amber-100 text-amber-800',
  excused: 'bg-blue-100 text-blue-800',
};

type SearchParams = Promise<{ studentId?: string }>;

export default async function ParentAttendancePage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole(PARENT_PORTAL_ROLES);
  const params = await searchParams;

  const children = await listMyChildren();
  const ward = children.find((child) => child.studentId === params.studentId) ?? children[0] ?? null;
  const attendance = ward ? await getStudentAttendance(ward.studentId, 200) : null;

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Attendance History</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Every day marked by the class teacher, with the reason recorded on the register.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">
            {ward ? ward.fullName : 'No ward selected'}
          </div>
          <div className="text-[11px] text-[var(--muted-text)]">
            {ward?.className ?? 'No class assigned'}
          </div>
        </div>
      </div>

      <form
        method="get"
        className="bg-white p-4 border border-[var(--border)] rounded grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
      >
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="studentId">
            Ward
          </label>
          <select
            id="studentId"
            name="studentId"
            defaultValue={ward?.studentId ?? ''}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            {children.length === 0 && <option value="">No wards linked</option>}
            {children.map((child) => (
              <option key={child.studentId} value={child.studentId}>
                {child.fullName} ({child.className ?? 'no class'})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
        >
          Load attendance
        </button>
      </form>

      {!ward || !attendance ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No wards are linked to this account yet. Please contact the school office.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Attendance Rate', value: `${attendance.rate}%`, tone: 'text-[var(--primary-dark)]' },
              { label: 'Present', value: String(attendance.summary.present), tone: 'text-green-700' },
              { label: 'Absent', value: String(attendance.summary.absent), tone: 'text-red-700' },
              { label: 'Late', value: String(attendance.summary.late), tone: 'text-amber-700' },
              { label: 'Excused', value: String(attendance.summary.excused), tone: 'text-blue-700' },
            ].map((tile) => (
              <div key={tile.label} className="bg-white p-4 border border-[var(--border)] rounded">
                <div className="text-[10px] font-bold text-[var(--muted-text)]">{tile.label}</div>
                <div className={`text-xl font-extrabold ${tile.tone}`}>{tile.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[var(--primary-dark)]">Recent register entries</span>
              <span className="text-[10px] text-[var(--muted-text)]">
                {attendance.summary.total} day{attendance.summary.total === 1 ? '' : 's'} on record
              </span>
            </div>

            {attendance.recent.length === 0 ? (
              <p className="p-6 text-[var(--muted-text)]">
                No attendance has been recorded yet. Entries appear here as soon as the class teacher
                marks the register.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {attendance.recent.map((day) => (
                      <tr key={day.id} className="hover:bg-[var(--soft-bg)]">
                        <td className="p-3 font-bold text-[var(--primary-dark)]">
                          {formatDate(day.date)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${STATUS_TONES[day.status]}`}
                          >
                            {day.status}
                          </span>
                        </td>
                        <td className="p-3 text-[var(--muted-text)]">{day.subjectName ?? 'Daily'}</td>
                        <td className="p-3 text-[var(--muted-text)]">{day.remarks ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-wrap gap-4">
            <Link href="/parent" className="font-bold text-[var(--primary)] hover:underline">
              ← Back to dashboard
            </Link>
            <Link
              href={`/parent/results?studentId=${ward.studentId}`}
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Term results
            </Link>
            <Link
              href={`/parent/fees?studentId=${ward.studentId}`}
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Fee statement
            </Link>
            <span className="ml-auto text-[10px] text-[var(--muted-text)]">
              {titleCase(ward.relationship)} of {ward.fullName}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
