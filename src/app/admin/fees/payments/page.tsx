'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { paymentReceiptsStore, PaymentReceipt } from '@/lib/financeStore';

export default function AdminPaymentsPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Transactions & Audit Logs</h1>
          <p className="text-sm text-slate-500">Verified online gateway transactions (Paystack, Flutterwave) and generated receipts.</p>
        </div>
        <Link
          href="/admin/fees"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          &larr; Bursary Overview
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Server-Verified Gateway Logs</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50">
                <th className="py-2.5 px-3">Receipt Ref</th>
                <th className="py-2.5 px-3">Gateway Reference</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Payer / Parent</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentReceiptsStore.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{rec.receiptNumber}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700">{rec.transactionReference}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">{rec.studentName}</span>
                    <span className="text-[10px] text-slate-400">{rec.admissionNo}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{rec.parentName}</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-800">₦{rec.amountPaid.toLocaleString()}</td>
                  <td className="py-3 px-3 font-semibold text-slate-600">{rec.paymentMethod}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{rec.date}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      <i className="bi bi-patch-check-fill mr-1"></i> VERIFIED
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="text-center border-b border-slate-100 pb-4 space-y-1">
              <div className="w-12 h-12 bg-blue-900 text-white font-bold rounded-2xl flex items-center justify-center text-lg mx-auto">
                JES
              </div>
              <h2 className="text-lg font-bold text-slate-900">{selectedReceipt.schoolName}</h2>
              <p className="text-[11px] text-slate-500">Official Payment Verification Receipt</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Receipt Number:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono text-blue-700">{selectedReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.studentName} ({selectedReceipt.admissionNo})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Parent / Payer:</span>
                <span className="font-medium text-slate-800">{selectedReceipt.parentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Gateway Method:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date & Time Verified:</span>
                <span className="text-slate-800">{selectedReceipt.date}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-emerald-900">
                <span className="font-bold">Amount Verified Paid:</span>
                <span className="text-lg font-extrabold">₦{selectedReceipt.amountPaid.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                <i className="bi bi-printer mr-1"></i> Print Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
