import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STAFF_PORTAL_ROLES } from '@/lib/auth/roles';
import {
  getAttendanceRegister,
  getCurrentTerm,
  listTeacherClasses,
  summariseAttendance,
} from '@/lib/data/academics';
import { formatDate, termLabel, todayIso } from '@/lib/format';
import AttendanceForm from './AttendanceForm';

export const metadata = { title: 'Attendance Register | JES Staff' };

type SearchParams = Promise<{ classId?: string; date?: string }>;

export default async function StaffAttendancePage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireRole(STAFF_PORTAL_ROLES);
  const params = await searchParams;

  const [classes, term] = await Promise.all([listTeacherClasses(user.id), getCurrentTerm()]);

  const selectedClass =
    classes.find((item) => item.id === params.classId) ?? classes[0] ?? null;
  const attendanceDate = /^\d{4}-\d{2}-\d{2}$/.test(params.date ?? '')
    ? (params.date as string)
    : todayIso();

  const entries = selectedClass
    ? await getAttendanceRegister(selectedClass.id, attendanceDate)
    : [];
  const summary = summariseAttendance(entries);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Daily Attendance Register</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Mark present, absent, late or excused for every student. Saved marks appear instantly on the
            administration register and parent portal.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">{termLabel(term)}</div>
          <div className="text-[11px] text-[var(--muted-text)]">{formatDate(attendanceDate)}</div>
        </div>
      </div>

      <form
        method="get"
        className="bg-white p-4 border border-[var(--border)] rounded flex flex-col sm:flex-row sm:items-end gap-3"
      >
        <div className="flex-1">
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
                {item.name} ({item.studentCount} students)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={attendanceDate}
            className="p-2 border border-[var(--border)] rounded font-mono font-bold"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
        >
          Load register
        </button>
      </form>

      {classes.length === 0 ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No classes are linked to your account yet. Ask an administrator to assign you as a form teacher
          or subject teacher.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Present', value: summary.present, tone: 'text-green-700' },
              { label: 'Absent', value: summary.absent, tone: 'text-red-700' },
              { label: 'Late', value: summary.late, tone: 'text-amber-700' },
              { label: 'Excused', value: summary.excused, tone: 'text-blue-700' },
              { label: 'Unmarked', value: summary.unmarked, tone: 'text-slate-600' },
            ].map((tile) => (
              <div key={tile.label} className="bg-white p-4 border border-[var(--border)] rounded">
                <div className="text-[11px] font-bold text-[var(--muted-text)]">{tile.label}</div>
                <div className={`text-xl font-extrabold ${tile.tone}`}>{tile.value}</div>
              </div>
            ))}
          </div>

          {selectedClass && (
            <AttendanceForm
              classId={selectedClass.id}
              className={selectedClass.name}
              attendanceDate={attendanceDate}
              termId={term?.id ?? ''}
              entries={entries}
            />
          )}
        </>
      )}

      <div className="bg-white p-4 border border-[var(--border)] rounded">
        <Link href="/staff/my-classes" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to my classes
        </Link>
      </div>
    </div>
  );
}
