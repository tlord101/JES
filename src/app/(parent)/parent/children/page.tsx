import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { PARENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getFamilyOverview, listStudentReportCards, performanceBand } from '@/lib/data/portal';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';

export const metadata = { title: 'My Wards | JES Parent Portal' };

export default async function ParentChildrenPage() {
  await requireRole(PARENT_PORTAL_ROLES);

  const family = await getFamilyOverview();
  const reportCards = await Promise.all(
    family.map((item) => listStudentReportCards(item.ward.studentId))
  );

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">My Wards</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Enrolment details, attendance record, published results and fee position for every child
          linked to your account.
        </p>
      </div>

      {family.length === 0 ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No wards are linked to this account yet. Please contact the school office so an administrator
          can link your account to your children.
        </div>
      ) : (
        family.map(({ ward, attendance, results, average, fees }, index) => {
          const published = reportCards[index] ?? [];
          const newestCard = published[0] ?? null;
          const { summary } = attendance;

          return (
            <div
              key={ward.studentId}
              className="bg-white border border-[var(--border)] rounded overflow-hidden"
            >
              <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-[var(--primary-dark)]">
                      {ward.fullName}
                    </h2>
                    <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-bold rounded uppercase">
                      {ward.status}
                    </span>
                    {ward.isPrimary && (
                      <span className="px-2 py-0.5 bg-[var(--soft-bg)] border border-[var(--border)] text-[10px] font-bold rounded uppercase text-[var(--muted-text)]">
                        Primary contact
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--muted-text)]">
                    {ward.className ?? 'No class assigned'} • Reg No: {ward.admissionNo} •{' '}
                    {titleCase(ward.relationship)} • {titleCase(ward.gender)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/parent/results?studentId=${ward.studentId}`}
                    className="px-3 py-1.5 border border-[var(--border)] rounded font-bold hover:bg-[var(--soft-bg)]"
                  >
                    Results
                  </Link>
                  <Link
                    href={`/parent/attendance?studentId=${ward.studentId}`}
                    className="px-3 py-1.5 border border-[var(--border)] rounded font-bold hover:bg-[var(--soft-bg)]"
                  >
                    Attendance
                  </Link>
                  <Link
                    href={`/parent/fees?studentId=${ward.studentId}`}
                    className="px-3 py-1.5 border border-[var(--border)] rounded font-bold hover:bg-[var(--soft-bg)]"
                  >
                    Fees
                  </Link>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <div className="text-[10px] font-bold text-[var(--muted-text)]">TERM AVERAGE</div>
                  <div className="text-lg font-extrabold text-[var(--primary-dark)]">
                    {average === null ? '—' : `${average}%`}
                  </div>
                  <div className="text-[10px] text-[var(--muted-text)]">
                    {performanceBand(average)}
                  </div>
                </div>
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <div className="text-[10px] font-bold text-[var(--muted-text)]">ATTENDANCE RATE</div>
                  <div className="text-lg font-extrabold text-[var(--primary-dark)]">
                    {attendance.rate}%
                  </div>
                  <div className="text-[10px] text-[var(--muted-text)]">
                    {summary.total} day{summary.total === 1 ? '' : 's'} marked
                  </div>
                </div>
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <div className="text-[10px] font-bold text-[var(--muted-text)]">
                    PUBLISHED SUBJECTS
                  </div>
                  <div className="text-lg font-extrabold text-[var(--primary-dark)]">
                    {results.length}
                  </div>
                  <div className="text-[10px] text-[var(--muted-text)]">
                    {published.length} report card{published.length === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <div className="text-[10px] font-bold text-[var(--muted-text)]">OUTSTANDING</div>
                  <div
                    className={`text-lg font-extrabold ${
                      fees.outstanding > 0 ? 'text-red-700' : 'text-green-700'
                    }`}
                  >
                    {formatCurrency(fees.outstanding)}
                  </div>
                  <div className="text-[10px] text-[var(--muted-text)]">
                    {formatCurrency(fees.paid)} paid to date
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--border)] grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-[var(--primary-dark)]">Attendance breakdown</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Present', value: summary.present, tone: 'text-green-700' },
                      { label: 'Absent', value: summary.absent, tone: 'text-red-700' },
                      { label: 'Late', value: summary.late, tone: 'text-amber-700' },
                      { label: 'Excused', value: summary.excused, tone: 'text-blue-700' },
                    ].map((tile) => (
                      <div
                        key={tile.label}
                        className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded"
                      >
                        <div className="text-[10px] font-bold text-[var(--muted-text)]">
                          {tile.label}
                        </div>
                        <div className={`text-lg font-extrabold ${tile.tone}`}>{tile.value}</div>
                      </div>
                    ))}
                  </div>
                  {attendance.recent.length > 0 && (
                    <ul className="space-y-1">
                      {attendance.recent.slice(0, 4).map((day) => (
                        <li
                          key={day.id}
                          className="flex items-center justify-between gap-2 px-3 py-2 bg-[var(--soft-bg)] border border-[var(--border)] rounded"
                        >
                          <span className="font-semibold">{formatDate(day.date)}</span>
                          <span className="text-[10px] font-bold uppercase text-[var(--muted-text)]">
                            {titleCase(day.status)}
                            {day.subjectName ? ` • ${day.subjectName}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-[var(--primary-dark)]">Latest report card</h3>
                  {newestCard ? (
                    <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold">{titleCase(newestCard.termName)}</span>
                        <span className="text-[10px] text-[var(--muted-text)]">
                          Published {formatDate(newestCard.publishedAt)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white border border-[var(--border)] rounded">
                          <div className="text-[10px] font-bold text-[var(--muted-text)]">AVERAGE</div>
                          <div className="font-bold text-[var(--primary-dark)]">
                            {newestCard.averageScore === null ? '—' : `${newestCard.averageScore}%`}
                          </div>
                        </div>
                        <div className="p-2 bg-white border border-[var(--border)] rounded">
                          <div className="text-[10px] font-bold text-[var(--muted-text)]">POSITION</div>
                          <div className="font-bold text-[var(--primary-dark)]">
                            {newestCard.positionInClass ?? '—'}
                            {newestCard.classSize ? ` of ${newestCard.classSize}` : ''}
                          </div>
                        </div>
                      </div>
                      {newestCard.classTeacherRemark && (
                        <p className="text-[11px] text-[var(--muted-text)]">
                          <span className="font-bold text-[var(--text)]">Class teacher:</span>{' '}
                          {newestCard.classTeacherRemark}
                        </p>
                      )}
                      {newestCard.principalRemark && (
                        <p className="text-[11px] text-[var(--muted-text)]">
                          <span className="font-bold text-[var(--text)]">Principal:</span>{' '}
                          {newestCard.principalRemark}
                        </p>
                      )}
                      {newestCard.nextTermBegins && (
                        <p className="text-[10px] text-[var(--muted-text)]">
                          Next term begins {formatDate(newestCard.nextTermBegins)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[var(--muted-text)]">
                      No report card has been published yet. Report cards appear here as soon as the
                      school publishes them.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
