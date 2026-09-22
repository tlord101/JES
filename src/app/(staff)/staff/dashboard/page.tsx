import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STAFF_PORTAL_ROLES } from '@/lib/auth/roles';
import { getTeacherDashboard } from '@/lib/data/academics';
import { listAnnouncements } from '@/lib/data/cms';
import { formatDate, termLabel } from '@/lib/format';

export const metadata = { title: 'Staff Dashboard | JES' };

export default async function StaffDashboardPage() {
  const user = await requireRole(STAFF_PORTAL_ROLES);
  const [dashboard, announcements] = await Promise.all([
    getTeacherDashboard(user.id),
    listAnnouncements({ publishedOnly: true, audience: 'staff', limit: 4 }),
  ]);

  const stats = [
    {
      label: 'My Classes',
      value: String(dashboard.classes.length),
      hint: dashboard.classes.map((item) => item.name).join(', ') || 'No classes assigned yet',
      icon: 'bi-journal-bookmark-fill',
    },
    {
      label: 'Enrolled Students',
      value: String(dashboard.studentCount),
      hint: 'Active students across your classes',
      icon: 'bi-people-fill',
    },
    {
      label: 'Attendance Marked Today',
      value: String(dashboard.attendanceMarkedToday),
      hint: formatDate(new Date()),
      icon: 'bi-clipboard-check-fill',
    },
    {
      label: 'Draft Scores',
      value: String(dashboard.draftResults),
      hint: `${dashboard.submittedResults} submitted for review`,
      icon: 'bi-pencil-square',
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
              Staff Portal
            </span>
            <span className="text-[11px] text-[var(--muted-text)]">{termLabel(dashboard.term)}</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Welcome, {user.fullName}</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Mark the daily register, record continuous assessment scores and submit gradebooks for review.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/staff/attendance"
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-clipboard-check"></i>
            <span>Mark Attendance</span>
          </Link>
          <Link
            href="/staff/results-entry"
            className="px-4 py-2 border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-pencil-square"></i>
            <span>Enter Scores</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">{stat.label}</span>
              <i className={`bi ${stat.icon} text-lg text-[var(--primary)]`}></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">{stat.value}</div>
            <div className="text-[11px] text-slate-500 line-clamp-1">{stat.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[var(--border)] rounded overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-building text-[var(--primary)]"></i>
              <span>My Classes</span>
            </h2>
            <Link href="/staff/my-classes" className="text-[11px] font-bold text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          {dashboard.classes.length === 0 ? (
            <p className="p-6 text-[var(--muted-text)]">
              No classes are assigned to you yet. An administrator can link you to a class or a subject.
            </p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                  <th className="p-3">Class</th>
                  <th className="p-3">Room</th>
                  <th className="p-3 text-center">Students</th>
                  <th className="p-3 text-right">Register</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {dashboard.classes.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--soft-bg)]">
                    <td className="p-3">
                      <div className="font-bold text-[var(--primary-dark)]">{item.name}</div>
                      <div className="text-[11px] text-[var(--muted-text)]">
                        Form teacher: {item.classTeacherName ?? 'Unassigned'}
                      </div>
                    </td>
                    <td className="p-3 text-[var(--muted-text)]">{item.room ?? '—'}</td>
                    <td className="p-3 text-center font-mono font-bold">{item.studentCount}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/staff/attendance?classId=${item.id}`}
                        className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                      >
                        Open register →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-megaphone text-[var(--primary)]"></i>
              <span>Staff Announcements</span>
            </h2>
            {announcements.length === 0 ? (
              <p className="text-[var(--muted-text)]">No announcements have been published for staff.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-[var(--primary)]">
                        {announcement.priority}
                      </span>
                      <span className="text-[10px] text-[var(--muted-text)]">
                        {formatDate(announcement.publishAt)}
                      </span>
                    </div>
                    <p className="font-bold text-[var(--text)]">{announcement.title}</p>
                    <p className="text-[11px] text-[var(--muted-text)] line-clamp-3">{announcement.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-lightning-charge text-[var(--primary)]"></i>
              <span>Quick Actions</span>
            </h2>
            <div className="space-y-2">
              {[
                { href: '/staff/my-classes', label: 'Class list & rosters', icon: 'bi-list-ul' },
                { href: '/staff/students', label: 'My students', icon: 'bi-people' },
                { href: '/staff/results-entry', label: 'Gradebook submission', icon: 'bi-bar-chart' },
                { href: '/profile', label: 'My profile', icon: 'bi-person-circle' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2 p-2.5 border border-[var(--border)] rounded hover:bg-[var(--soft-bg)] font-semibold text-[var(--text)]"
                >
                  <i className={`bi ${action.icon} text-[var(--primary)]`}></i>
                  <span>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
