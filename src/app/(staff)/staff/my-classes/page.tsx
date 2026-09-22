import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STAFF_PORTAL_ROLES } from '@/lib/auth/roles';
import { listTeacherClasses } from '@/lib/data/academics';

export const metadata = { title: 'My Classes | JES Staff' };

export default async function StaffClassesPage() {
  const user = await requireRole(STAFF_PORTAL_ROLES);
  const classes = await listTeacherClasses(user.id);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">My Classes</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Classes where you are the form teacher or teach a subject. Open the register or the gradebook
          directly from this list.
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No classes are assigned to you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map((item) => (
            <div key={item.id} className="bg-white p-5 border border-[var(--border)] rounded space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[var(--primary-dark)]">{item.name}</h2>
                  <p className="text-[11px] text-[var(--muted-text)] capitalize">
                    {item.level} {item.arm ? `· Arm ${item.arm}` : ''}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[11px] font-bold rounded">
                  {item.studentCount} students
                </span>
              </div>

              <dl className="space-y-1 text-[11px] text-[var(--muted-text)]">
                <div className="flex gap-2">
                  <dt className="font-bold">Form teacher:</dt>
                  <dd>{item.classTeacherName ?? 'Unassigned'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold">Room:</dt>
                  <dd>{item.room ?? '—'}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/staff/attendance?classId=${item.id}`}
                  className="px-3 py-1.5 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
                >
                  Attendance
                </Link>
                <Link
                  href={`/staff/results-entry?classId=${item.id}`}
                  className="px-3 py-1.5 border border-[var(--border)] font-bold rounded hover:bg-[var(--soft-bg)]"
                >
                  Gradebook
                </Link>
                <Link
                  href={`/staff/students?classId=${item.id}`}
                  className="px-3 py-1.5 border border-[var(--border)] font-bold rounded hover:bg-[var(--soft-bg)]"
                >
                  Roster
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-4 border border-[var(--border)] rounded">
        <Link href="/staff/dashboard" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
