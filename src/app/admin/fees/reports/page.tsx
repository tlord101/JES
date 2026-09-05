'use client';

import React from 'react';
import Link from 'next/link';
import { studentInvoicesStore, paymentReceiptsStore } from '@/lib/financeStore';

export default function AdminFinancialReportsPage() {
  const totalInvoiced = studentInvoicesStore.reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = studentInvoicesStore.reduce((s, i) => s + i.amountPaid, 0);
  const totalOutstanding = studentInvoicesStore.reduce((s, i) => s + i.balanceDue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial & Revenue Analytics</h1>
          <p className="text-sm text-slate-500">Termly revenue distribution, outstanding debt collection metrics, and payment gateway breakdowns.</p>
        </div>
        <Link
          href="/admin/fees"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          &larr; Bursary Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Term Revenue Target</span>
          <div className="text-2xl font-extrabold text-slate-900">₦{totalInvoiced.toLocaleString()}</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-full"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase">Total Realized Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-700">₦{totalPaid.toLocaleString()}</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full"
              style={{ width: `${Math.round((totalPaid / (totalInvoiced || 1)) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase">Uncollected Outstanding Deficit</span>
          <div className="text-2xl font-extrabold text-amber-700">₦{totalOutstanding.toLocaleString()}</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${Math.round((totalOutstanding / (totalInvoiced || 1)) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Revenue Breakdown by Fee Category</h2>
          <div className="space-y-3 text-xs">
            {[
              { category: 'Tuition Fees', percent: 60, amount: totalPaid * 0.6 },
              { category: 'Textbooks & Course Workbooks', percent: 15, amount: totalPaid * 0.15 },
              { category: 'School Uniforms & Physical Kit', percent: 10, amount: totalPaid * 0.1 },
              { category: 'CBT & Examination Charges', percent: 8, amount: totalPaid * 0.08 },
              { category: 'Sports & Co-Curricular', percent: 7, amount: totalPaid * 0.07 },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{cat.category}</span>
                  <span>₦{Math.round(cat.amount).toLocaleString()} ({cat.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Payment Gateway Channel Analytics</h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Paystack Gateway</span>
                <span className="text-[10px] text-slate-500">Verified Direct Debit / Card Transactions</span>
              </div>
              <span className="font-extrabold text-blue-900 text-sm">
                ₦{paymentReceiptsStore.filter(r => r.paymentMethod === 'Paystack').reduce((s, r) => s + r.amountPaid, 0).toLocaleString()}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Flutterwave Gateway</span>
                <span className="text-[10px] text-slate-500">Verified Bank Transfer & Mobile Money</span>
              </div>
              <span className="font-extrabold text-blue-900 text-sm">
                ₦{paymentReceiptsStore.filter(r => r.paymentMethod === 'Flutterwave').reduce((s, r) => s + r.amountPaid, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
