'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { studentInvoicesStore } from '@/lib/financeStore';

export default function AdminInvoicesListPage() {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = studentInvoicesStore.filter((inv) => {
    const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Invoices</h1>
          <p className="text-sm text-slate-500">Track fee billing, payment statuses, and balance breakdown for registered students.</p>
        </div>
        <Link
          href="/admin/fees"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          &larr; Bursary Overview
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 text-xs">
            {['All', 'Paid', 'Partially Paid', 'Pending', 'Overdue'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <i className="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search invoice or student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50">
                <th className="py-2.5 px-3">Invoice Ref</th>
                <th className="py-2.5 px-3">Student & Class</th>
                <th className="py-2.5 px-3">Parent / Contact</th>
                <th className="py-2.5 px-3">Total Fee</th>
                <th className="py-2.5 px-3">Amount Paid</th>
                <th className="py-2.5 px-3">Balance Due</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{inv.studentName}</span>
                    <span className="text-[10px] text-slate-400">{inv.className} ({inv.admissionNo})</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800 block">{inv.parentName}</span>
                    <span className="text-[10px] text-slate-400">{inv.parentEmail}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">₦{inv.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">₦{inv.amountPaid.toLocaleString()}</td>
                  <td className="py-3 px-3 text-amber-700 font-bold">₦{inv.balanceDue.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{inv.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
