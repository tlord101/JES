import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { PARENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { listTerms } from '@/lib/data/academics';
import { getStudentFees, listMyChildren } from '@/lib/data/portal';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';

export const metadata = { title: 'Fee Statement | JES Parent Portal' };

const STATUS_TONES: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-amber-100 text-amber-800',
  unpaid: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-700',
};

type SearchParams = Promise<{ studentId?: string }>;

export default async function ParentFeesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireRole(PARENT_PORTAL_ROLES);
  const params = await searchParams;

  const [children, terms] = await Promise.all([listMyChildren(), listTerms()]);
  const ward = children.find((child) => child.studentId === params.studentId) ?? children[0] ?? null;
  const fees = ward ? await getStudentFees(ward.studentId) : null;
  const termById = new Map(terms.map((term) => [term.id, term]));

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Fee Statement</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Every invoice raised by the bursary, the amount received and the outstanding balance.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">
            {ward ? ward.fullName : 'No ward selected'}
          </div>
          <div className="text-[11px] text-[var(--muted-text)]">
            Reg No: {ward?.admissionNo ?? '—'}
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
          Load statement
        </button>
      </form>

      {!ward || !fees ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-[var(--muted-text)]">
          No wards are linked to this account yet. Please contact the school office.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 border border-[var(--border)] rounded">
              <div className="text-[10px] font-bold text-[var(--muted-text)]">TOTAL BILLED</div>
              <div className="text-xl font-extrabold text-[var(--primary-dark)]">
                {formatCurrency(fees.billed)}
              </div>
              <div className="text-[10px] text-[var(--muted-text)]">
                {fees.invoices.length} invoice{fees.invoices.length === 1 ? '' : 's'} raised
              </div>
            </div>
            <div className="bg-white p-4 border border-[var(--border)] rounded">
              <div className="text-[10px] font-bold text-[var(--muted-text)]">TOTAL PAID</div>
              <div className="text-xl font-extrabold text-green-700">{formatCurrency(fees.paid)}</div>
              <div className="text-[10px] text-[var(--muted-text)]">
                {fees.payments.length} payment{fees.payments.length === 1 ? '' : 's'} received
              </div>
            </div>
            <div className="bg-white p-4 border border-[var(--border)] rounded">
              <div className="text-[10px] font-bold text-[var(--muted-text)]">OUTSTANDING</div>
              <div
                className={`text-xl font-extrabold ${
                  fees.outstanding > 0 ? 'text-red-700' : 'text-green-700'
                }`}
              >
                {formatCurrency(fees.outstanding)}
              </div>
              <div className="text-[10px] text-[var(--muted-text)]">
                {fees.outstanding > 0 ? 'Payment outstanding' : 'All invoices settled'}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
              Invoices
            </div>

            {fees.invoices.length === 0 ? (
              <p className="p-6 text-[var(--muted-text)]">
                No invoice has been raised for this ward yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                      <th className="p-3">Invoice No</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Term</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-right">Paid</th>
                      <th className="p-3 text-right">Balance</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {fees.invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-[var(--soft-bg)]">
                        <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">
                          {invoice.invoice_no}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-[var(--text)]">{invoice.title}</div>
                          <div className="text-[10px] text-[var(--muted-text)]">
                            Issued {formatDate(invoice.issued_at)}
                          </div>
                        </td>
                        <td className="p-3 text-[var(--muted-text)]">
                          {invoice.term_id ? titleCase(termById.get(invoice.term_id)?.name ?? '—') : '—'}
                        </td>
                        <td className="p-3 text-right font-mono">
                          {formatCurrency(invoice.total_amount)}
                        </td>
                        <td className="p-3 text-right font-mono text-green-700">
                          {formatCurrency(invoice.amount_paid)}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-red-700">
                          {formatCurrency(invoice.balance)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              STATUS_TONES[invoice.status] ?? 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="p-3 text-[var(--muted-text)]">
                          {invoice.due_date ? formatDate(invoice.due_date) : '—'}
                        </td>
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
              href={`/parent/payments?studentId=${ward.studentId}`}
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Payment history
            </Link>
            <Link
              href={`/parent/results?studentId=${ward.studentId}`}
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Term results
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
