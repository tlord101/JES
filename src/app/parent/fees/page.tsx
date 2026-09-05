'use client';

import Link from 'next/link';
import { defaultWards } from '@/lib/parentData';

export default function ParentFeesOverviewPage() {
  const totalOutstanding = defaultWards.reduce((acc, w) => acc + w.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Financial Ledger
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            School Fees & Payment Portfolios
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Track fee statements, outstanding balances, server-verified online payments, and download receipts.
          </p>
        </div>

        <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-right">
          <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase block">Total Outstanding Portfolio</span>
          <span className={`text-lg font-black ${totalOutstanding <= 0 ? 'text-green-700' : 'text-red-600'}`}>
            ₦{totalOutstanding.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Grid of Children Fee Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultWards.map((ward) => (
          <div
            key={ward.id}
            className="bg-white border border-[var(--border)] rounded p-6 space-y-4 hover:border-[var(--primary)] transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-[var(--border)] pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-[var(--primary-dark)]">{ward.name}</h2>
                  <p className="text-xs text-[var(--muted-text)] font-semibold">Class: {ward.class}</p>
                </div>

                <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded ${
                  ward.outstandingBalance <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {ward.outstandingBalance <= 0 ? 'Paid in Full' : 'Outstanding Balance'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <span className="text-[10px] text-[var(--muted-text)] font-bold block">TOTAL FEES</span>
                  <span className="font-extrabold text-[var(--primary-dark)] font-mono">₦{ward.totalFees.toLocaleString()}</span>
                </div>

                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <span className="text-[10px] text-[var(--muted-text)] font-bold block">AMOUNT PAID</span>
                  <span className="font-extrabold text-green-700 font-mono">₦{ward.amountPaid.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <Link
                href={`/parent/fees/${ward.id}`}
                className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
              >
                <i className="bi bi-credit-card"></i>
                <span>Manage & Pay Fees</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
