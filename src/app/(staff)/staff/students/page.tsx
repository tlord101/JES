import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STAFF_PORTAL_ROLES } from '@/lib/auth/roles';
import { listStudentsByClasses, listTeacherClasses } from '@/lib/data/academics';
import { todayIso } from '@/lib/format';

export const metadata = { title: 'My Students | JES Staff' };

type SearchParams = Promise<{ classId?: string; q?: string }>;

export default async function StaffStudentsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireRole(STAFF_PORTAL_ROLES);
  const params = await searchParams;

  const classes = await listTeacherClasses(user.id);
  const selectedClassId = classes.some((item) => item.id === params.classId)
    ? (params.classId as string)
    : '';

  const students = await listStudentsByClasses(
    selectedClassId ? [selectedClassId] : classes.map((item) => item.id)
  );

  const query = (params.q ?? '').trim().toLowerCase();
  const filtered = query
    ? students.filter(
        (student) =>
          student.fullName.toLowerCase().includes(query) ||
          student.admissionNo.toLowerCase().includes(query)
      )
    : students;

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">My Students</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Active learners across the classes you teach. Search by name or admission number.
        </p>
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
            defaultValue={selectedClassId}
            className="w-full p-2 border border-[var(--border)] rounded font-bold"
          >
            <option value="">All my classes</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1" htmlFor="q">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={params.q ?? ''}
            placeholder="Student name or admission number"
            className="w-full p-2 border border-[var(--border)] rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
        >
          Filter
        </button>
      </form>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
          {filtered.length} student{filtered.length === 1 ? '' : 's'}
        </div>

        {filtered.length === 0 ? (
          <p className="p-6 text-[var(--muted-text)]">
            No students matched this filter. Students appear here once they are enrolled and marked active.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-[var(--soft-bg)]">
                    <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">
                      {student.admissionNo}
                    </td>
                    <td className="p-3 font-bold text-[var(--text)]">{student.fullName}</td>
                    <td className="p-3 text-[var(--muted-text)]">{student.className ?? '—'}</td>
                    <td className="p-3 capitalize text-[var(--muted-text)]">{student.gender ?? '—'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase">
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {student.classId && (
                        <Link
                          href={`/staff/attendance?classId=${student.classId}&date=${todayIso()}`}
                          className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                        >
                          Open register →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded">
        <Link href="/staff/my-classes" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to my classes
        </Link>
      </div>
    </div>
  );
}
