import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { STUDENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getMyStudentRecord, getStudentDashboard, performanceBand } from '@/lib/data/portal';
import { listAnnouncements } from '@/lib/data/cms';
import { formatDate, formatTime } from '@/lib/format';

export const metadata = { title: 'Student Dashboard | JES' };

export default async function StudentDashboardPage() {
  const user = await requireRole(STUDENT_PORTAL_ROLES);
  const record = await getMyStudentRecord(user.id);

  if (!record) {
    return (
      <div className="space-y-6 text-xs">
        <div className="bg-white p-6 border border-[var(--border)] rounded">
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Welcome, {user.fullName}</h1>
        </div>
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No student record is linked to this account yet. Please contact the school office so the
          administration can link your account to your student profile.
        </div>
      </div>
    );
  }

  const [dashboard, announcements] = await Promise.all([
    getStudentDashboard(record),
    listAnnouncements({ publishedOnly: true, audience: 'students', limit: 4 }),
  ]);

  const stats = [
    {
      label: 'Term Average',
      value: dashboard.average === null ? '—' : `${dashboard.average}%`,
      hint: performanceBand(dashboard.average),
      icon: 'bi-award-fill',
    },
    {
      label: 'Attendance',
      value: `${dashboard.attendance.rate}%`,
      hint: `${dashboard.attendance.summary.present} present of ${dashboard.attendance.summary.total} days`,
      icon: 'bi-check-circle-fill',
    },
    {
      label: 'Published Subjects',
      value: String(dashboard.results.length),
      hint: 'Approved results only',
      icon: 'bi-journal-text',
    },
    {
      label: 'Pending Assignments',
      value: String(dashboard.pendingAssignments),
      hint: `${dashboard.assignmentCount} set in total`,
      icon: 'bi-journal-check',
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
              Student Portal
            </span>
            <span className="text-[11px] text-[var(--muted-text)]">
              {record.className ?? 'No class assigned'} • {record.admissionNo}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Diligence for Excellence — keep track of your timetable, attendance, results and
            assignments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/student/timetable"
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-table"></i>
            <span>My timetable</span>
          </Link>
          <Link
            href="/student/results"
            className="px-4 py-2 border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-bar-chart"></i>
            <span>My results</span>
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
            <div className="text-[11px] text-[var(--muted-text)]">{stat.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-journal-text text-[var(--primary)]"></i>
                <span>My Published Results</span>
              </h2>
              <Link
                href="/student/results"
                className="text-[11px] font-bold text-[var(--primary)] hover:underline"
              >
                Full broadsheet →
              </Link>
            </div>

            {dashboard.results.length === 0 ? (
              <p className="text-[var(--muted-text)]">
                No results have been published for you yet. Your teachers submit scores first and the
                school publishes them once they are approved.
              </p>
            ) : (
              <div className="space-y-2">
                {dashboard.results.slice(0, 6).map((result) => (
                  <div
                    key={result.id}
                    className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-[var(--primary-dark)]">{result.subjectName}</div>
                      <div className="text-[11px] text-[var(--muted-text)]">
                        CA1 {result.ca1Score} • CA2 {result.ca2Score} • Exam {result.examScore}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[var(--text)]">{result.totalScore}/100</div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded inline-block mt-0.5">
                        Grade {result.grade ?? '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-journal-check text-[var(--primary)]"></i>
                <span>Assignments</span>
              </h2>
              <Link
                href="/student/assignments"
                className="text-[11px] font-bold text-[var(--primary)] hover:underline"
              >
                All assignments →
              </Link>
            </div>

            {dashboard.nextAssignment ? (
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase">
                    Due next
                  </span>
                  <span className="text-[11px] text-[var(--muted-text)]">
                    {dashboard.nextAssignment.dueDate
                      ? formatDate(dashboard.nextAssignment.dueDate)
                      : 'No due date set'}
                  </span>
                </div>
                <p className="font-bold text-[var(--primary-dark)]">
                  {dashboard.nextAssignment.title}
                </p>
                <p className="text-[11px] text-[var(--muted-text)]">
                  {dashboard.nextAssignment.subjectName ?? 'General'} • out of{' '}
                  {dashboard.nextAssignment.maxScore} marks
                </p>
              </div>
            ) : (
              <p className="text-[var(--muted-text)]">
                Nothing is outstanding. New assignments appear here as soon as your teachers publish
                them.
              </p>
            )}
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-megaphone text-[var(--primary)]"></i>
              <span>Student Announcements</span>
            </h2>
            {announcements.length === 0 ? (
              <p className="text-[var(--muted-text)]">
                No announcements have been published for students yet.
              </p>
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
                    <p className="text-[11px] text-[var(--muted-text)] line-clamp-3">
                      {announcement.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-clock-history text-[var(--primary)]"></i>
              <span>Today&apos;s Classes</span>
            </h2>
            {dashboard.lessonsToday.length === 0 ? (
              <p className="text-[var(--muted-text)]">
                No lessons are scheduled for today. Check the full timetable for the week.
              </p>
            ) : (
              <div className="space-y-3">
                {dashboard.lessonsToday.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded"
                  >
                    <div className="font-bold text-[var(--primary-dark)]">{lesson.subjectName}</div>
                    <div className="text-[11px] text-[var(--muted-text)] font-mono">
                      {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                    </div>
                    <div className="text-[11px] text-[var(--muted-text)]">
                      {lesson.teacherName ?? 'Teacher to be assigned'}
                      {lesson.room ? ` • ${lesson.room}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-lightning-charge text-[var(--primary)]"></i>
              <span>Quick Links</span>
            </h2>
            <div className="space-y-2">
              {[
                { href: '/student/timetable', label: 'Weekly timetable', icon: 'bi-table' },
                { href: '/student/results', label: 'Results & report cards', icon: 'bi-bar-chart' },
                { href: '/student/attendance', label: 'My attendance', icon: 'bi-clipboard-check' },
                { href: '/student/assignments', label: 'Assignments', icon: 'bi-journal-check' },
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
