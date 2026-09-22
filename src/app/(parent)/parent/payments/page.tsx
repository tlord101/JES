import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { PARENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { getStudentFees, listMyChildren } from '@/lib/data/portal';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';

export const metadata = { title: 'Payment History | JES Parent Portal' };

const PAYMENT_TONES: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
  reversed: 'bg-slate-100 text-slate-700',
};

type SearchParams = Promise<{ studentId?: string }>;

export default async function ParentPaymentsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole(PARENT_PORTAL_ROLES);
  const params = await searchParams;

  const children = await listMyChildren();
  const ward = children.find((child) => child.studentId === params.studentId) ?? children[0] ?? null;
  const fees = ward ? await getStudentFees(ward.studentId) : null;

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Payment History</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Payments recorded by the bursary against your ward&apos;s invoices.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">
            {ward ? ward.fullName : 'No ward selected'}
          </div>
          <div className="text-[11px] text-[var(--muted-text)]">
            Outstanding {fees ? formatCurrency(fees.outstanding) : '—'}
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
          Load payments
        </button>
      </form>

      {!ward || !fees ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No wards are linked to this account yet. Please contact the school office.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: 'Cleared Payments',
                value: formatCurrency(fees.paid),
                hint: 'Completed transactions',
                tone: 'text-green-700',
              },
              {
                label: 'Billed To Date',
                value: formatCurrency(fees.billed),
                hint: 'Invoices excluding cancelled',
                tone: 'text-[var(--primary-dark)]',
              },
              {
                label: 'Outstanding Balance',
                value: formatCurrency(fees.outstanding),
                hint: fees.outstanding > 0 ? 'Payment outstanding' : 'Fully settled',
                tone: fees.outstanding > 0 ? 'text-red-700' : 'text-green-700',
              },
            ].map((tile) => (
              <div key={tile.label} className="bg-white p-4 border border-[var(--border)] rounded">
                <div className="text-[10px] font-bold text-[var(--muted-text)]">{tile.label}</div>
                <div className={`text-xl font-extrabold ${tile.tone}`}>{tile.value}</div>
                <div className="text-[10px] text-[var(--muted-text)]">{tile.hint}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
              Recorded Payments
            </div>

            {fees.payments.length === 0 ? (
              <p className="p-6 text-[var(--muted-text)]">
                No payment has been recorded for this ward yet. Receipts appear here as soon as the
                bursary posts a payment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                      <th className="p-3">Date</th>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Method</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Narration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {fees.payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[var(--soft-bg)]">
                        <td className="p-3 font-bold text-[var(--primary-dark)]">
                          {formatDate(payment.paid_at)}
                        </td>
                        <td className="p-3 font-mono text-[var(--muted-text)]">
                          {payment.reference ?? '—'}
                        </td>
                        <td className="p-3 text-[var(--muted-text)]">
                          {titleCase(payment.method)}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[var(--primary-dark)]">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              PAYMENT_TONES[payment.status] ?? 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="p-3 text-[var(--muted-text)]">{payment.narration ?? '—'}</td>
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
              href={`/parent/fees?studentId=${ward.studentId}`}
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Invoice statement
            </Link>
            <Link
              href="/parent/messages"
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Query a payment
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
