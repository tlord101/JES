import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { PARENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { countUnreadMessages, getFamilyOverview } from '@/lib/data/portal';
import { getUpcomingEvents, listAnnouncements } from '@/lib/data/cms';
import { formatCurrency, formatDate } from '@/lib/format';

export const metadata = { title: 'Parent Dashboard | JES' };

export default async function ParentDashboardPage() {
  const user = await requireRole(PARENT_PORTAL_ROLES);

  const [family, unread, announcements, events] = await Promise.all([
    getFamilyOverview(),
    countUnreadMessages(user.id),
    listAnnouncements({ publishedOnly: true, audience: 'parents', limit: 4 }),
    getUpcomingEvents(3),
  ]);

  const outstanding = family.reduce((sum, item) => sum + item.fees.outstanding, 0);
  const scored = family.filter((item) => item.average !== null);
  const familyAverage =
    scored.length > 0
      ? Math.round(
          (scored.reduce((sum, item) => sum + (item.average ?? 0), 0) / scored.length) * 10
        ) / 10
      : null;

  const stats = [
    {
      label: 'Wards Enrolled',
      value: String(family.length),
      hint: family.map((item) => item.ward.fullName).join(', ') || 'No wards linked yet',
      icon: 'bi-people-fill',
    },
    {
      label: 'Average Score',
      value: familyAverage === null ? '—' : `${familyAverage}%`,
      hint: 'Across all published results',
      icon: 'bi-award-fill',
    },
    {
      label: 'Outstanding Fees',
      value: formatCurrency(outstanding),
      hint: 'Open invoice balances',
      icon: 'bi-cash-coin',
    },
    {
      label: 'Unread Messages',
      value: String(unread),
      hint: 'From the school office',
      icon: 'bi-envelope-fill',
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
              Parent / Guardian Portal
            </span>
            <span className="text-[11px] text-[var(--muted-text)]">
              {family.length} ward{family.length === 1 ? '' : 's'} linked
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Welcome, {user.fullName}</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Track your wards&apos; published results, attendance, report cards and fee statements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/parent/results"
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-bar-chart"></i>
            <span>Term results</span>
          </Link>
          <Link
            href="/parent/fees"
            className="px-4 py-2 border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-receipt"></i>
            <span>Fee statement</span>
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
            <div className="text-[11px] text-[var(--muted-text)] truncate">{stat.hint}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
            <i className="bi bi-person-badge text-[var(--primary)]"></i>
            <span>My Wards</span>
          </h2>
          <Link
            href="/parent/children"
            className="text-[11px] font-bold text-[var(--primary)] hover:underline"
          >
            View ward profiles →
          </Link>
        </div>

        {family.length === 0 ? (
          <p className="p-6 text-[var(--muted-text)]">
            No wards are linked to this account yet. The school office links a parent account to its
            children from the administration portal.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {family.map(({ ward, attendance, average, fees }) => (
              <div
                key={ward.studentId}
                className="p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[var(--primary-dark)]">{ward.fullName}</p>
                    <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-bold rounded uppercase">
                      {ward.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-text)]">
                    {ward.className ?? 'No class assigned'} • Reg No: {ward.admissionNo} •{' '}
                    {ward.relationship}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 xl:w-96">
                  <div className="p-2 bg-[var(--soft-bg)] rounded border border-[var(--border)]">
                    <div className="text-[10px] text-[var(--muted-text)] font-bold">TERM AVG</div>
                    <div className="font-bold text-[var(--primary-dark)] pt-0.5">
                      {average === null ? '—' : `${average}%`}
                    </div>
                  </div>
                  <div className="p-2 bg-[var(--soft-bg)] rounded border border-[var(--border)]">
                    <div className="text-[10px] text-[var(--muted-text)] font-bold">ATTENDANCE</div>
                    <div className="font-bold text-[var(--primary-dark)] pt-0.5">{attendance.rate}%</div>
                  </div>
                  <div className="p-2 bg-[var(--soft-bg)] rounded border border-[var(--border)]">
                    <div className="text-[10px] text-[var(--muted-text)] font-bold">FEES</div>
                    <div
                      className={`font-bold pt-0.5 ${
                        fees.outstanding > 0 ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      {fees.outstanding > 0 ? formatCurrency(fees.outstanding) : 'Settled'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { href: `/parent/results?studentId=${ward.studentId}`, label: 'Results' },
                    { href: `/parent/attendance?studentId=${ward.studentId}`, label: 'Attendance' },
                    { href: `/parent/fees?studentId=${ward.studentId}`, label: 'Invoices' },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="px-3 py-1.5 border border-[var(--border)] rounded font-bold hover:bg-[var(--soft-bg)]"
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-file-earmark-bar-graph text-[var(--primary)]"></i>
              <span>Latest Published Results</span>
            </h2>

            {scored.length === 0 ? (
              <p className="text-[var(--muted-text)]">
                No results have been published for your wards yet. Teachers record the scores first and
                the administration publishes them once they are approved.
              </p>
            ) : (
              <div className="space-y-3">
                {family
                  .filter((item) => item.results.length > 0)
                  .map(({ ward, results, average }) => (
                    <div
                      key={ward.studentId}
                      className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-[var(--primary-dark)]">{ward.fullName}</p>
                        <span className="text-[11px] font-bold text-[var(--primary)]">
                          {results.length} subject{results.length === 1 ? '' : 's'} • average{' '}
                          {average === null ? '—' : `${average}%`}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {results.slice(0, 3).map((result) => (
                          <div
                            key={result.id}
                            className="p-2 bg-white border border-[var(--border)] rounded"
                          >
                            <div className="text-[10px] font-bold text-[var(--muted-text)] truncate">
                              {result.subjectName}
                            </div>
                            <div className="font-bold text-[var(--primary-dark)]">
                              {result.totalScore}/100{' '}
                              <span className="text-[10px] text-green-700">{result.grade ?? ''}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href={`/parent/results?studentId=${ward.studentId}`}
                        className="inline-block text-[11px] font-bold text-[var(--primary)] hover:underline"
                      >
                        Open the full broadsheet →
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-megaphone text-[var(--primary)]"></i>
              <span>School Announcements</span>
            </h2>
            {announcements.length === 0 ? (
              <p className="text-[var(--muted-text)]">
                No announcements have been published for parents yet.
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
              <i className="bi bi-calendar-event text-[var(--primary)]"></i>
              <span>Upcoming School Events</span>
            </h2>
            {events.length === 0 ? (
              <p className="text-[var(--muted-text)]">No events are scheduled at the moment.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1"
                  >
                    <p className="font-bold text-[var(--primary-dark)]">{event.title}</p>
                    <p className="text-[11px] text-[var(--muted-text)]">
                      {formatDate(event.startsAt)}
                      {event.location ? ` • ${event.location}` : ''}
                    </p>
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
                { href: '/parent/children', label: 'My wards', icon: 'bi-people' },
                { href: '/parent/results', label: 'Results & report cards', icon: 'bi-bar-chart' },
                { href: '/parent/attendance', label: 'Attendance history', icon: 'bi-clipboard-check' },
                { href: '/parent/payments', label: 'Payment history', icon: 'bi-credit-card' },
                { href: '/parent/messages', label: 'Message the school office', icon: 'bi-envelope' },
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
