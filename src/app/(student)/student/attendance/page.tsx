import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STUDENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getMyStudentRecord, getStudentAttendance } from '@/lib/data/portal';
import { formatDate } from '@/lib/format';
import type { AttendanceStatus } from '@/types/database';

export const metadata = { title: 'My Attendance | JES Student Portal' };

const STATUS_TONES: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-amber-100 text-amber-800',
  excused: 'bg-blue-100 text-blue-800',
};

export default async function StudentAttendancePage() {
  const user = await requireRole(STUDENT_PORTAL_ROLES);
  const record = await getMyStudentRecord(user.id);

  if (!record) {
    return (
      <div className="space-y-6 text-xs">
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No student record is linked to this account yet, so there is no attendance to show. Please
          contact the school office.
        </div>
      </div>
    );
  }

  const attendance = await getStudentAttendance(record.studentId, 200);
  const summary = attendance.summary;

  const tiles = [
    { label: 'Attendance Rate', value: `${attendance.rate}%`, tone: 'text-[var(--primary-dark)]' },
    { label: 'Days Present', value: String(summary.present), tone: 'text-green-700' },
    { label: 'Days Absent', value: String(summary.absent), tone: 'text-red-700' },
    { label: 'Times Late', value: String(summary.late), tone: 'text-amber-700' },
    { label: 'Excused', value: String(summary.excused), tone: 'text-blue-700' },
  ];

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">My Attendance</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Every day marked by the class teacher, with the reason recorded on the register.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">
            {record.className ?? 'No class assigned'}
          </div>
          <div className="text-[11px] text-[var(--muted-text)]">{record.admissionNo}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tiles.map((tile) => (
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
            {summary.total} day{summary.total === 1 ? '' : 's'} on record
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
        <Link href="/student" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to dashboard
        </Link>
        <Link href="/student/timetable" className="font-bold text-[var(--primary)] hover:underline">
          Weekly timetable
        </Link>
        <Link href="/student/results" className="font-bold text-[var(--primary)] hover:underline">
          My results
        </Link>
      </div>
    </div>
  );
}