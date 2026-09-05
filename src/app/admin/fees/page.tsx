'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { studentInvoicesStore, paymentReceiptsStore, feeStructuresStore } from '@/lib/financeStore';

export default function AdminFeesOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const totalInvoiced = studentInvoicesStore.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = studentInvoicesStore.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = studentInvoicesStore.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const filteredInvoices = studentInvoicesStore.filter(
    (inv) =>
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bursary & Financial Management</h1>
          <p className="text-sm text-slate-500">Track fee structures, student invoices, online payment verification, and receipts.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/fees/structures/create"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-plus-lg"></i> Create Fee Schedule
          </Link>
          <Link
            href="/admin/fees/reports"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-bar-chart-fill"></i> Financial Reports
          </Link>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Invoiced</span>
          <div className="text-2xl font-extrabold text-slate-900">₦{totalInvoiced.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400">Current Academic Term</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Revenue Collected</span>
          <div className="text-2xl font-extrabold text-emerald-700">₦{totalCollected.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-medium">{collectionRate}% Collection Rate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Outstanding Balance</span>
          <div className="text-2xl font-extrabold text-amber-700">₦{totalOutstanding.toLocaleString()}</div>
          <span className="text-[11px] text-amber-600 font-medium">Due across active students</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Verified Transactions</span>
          <div className="text-2xl font-extrabold text-blue-700">{paymentReceiptsStore.length} Receipts</div>
          <span className="text-[11px] text-slate-400">Server Paystack/Flutterwave logs</span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <Link href="/admin/fees" className="pb-3 border-b-2 border-blue-600 text-blue-600">
          Overview & Quick Invoices
        </Link>
        <Link href="/admin/fees/structures" className="pb-3 text-slate-500 hover:text-slate-800">
          Fee Schedules ({feeStructuresStore.length})
        </Link>
        <Link href="/admin/fees/invoices" className="pb-3 text-slate-500 hover:text-slate-800">
          Invoices List ({studentInvoicesStore.length})
        </Link>
        <Link href="/admin/fees/payments" className="pb-3 text-slate-500 hover:text-slate-800">
          Payment Transactions ({paymentReceiptsStore.length})
        </Link>
        <Link href="/admin/fees/reports" className="pb-3 text-slate-500 hover:text-slate-800">
          Revenue Reports
        </Link>
      </div>

      {/* SEARCH & INVOICE TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-base font-bold text-slate-900">Student Invoices Quick View</h2>
          <div className="relative w-full sm:w-72">
            <i className="bi bi-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search by student name or invoice..."
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
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Paid</th>
                <th className="py-2.5 px-3">Balance</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {inv.studentName}
                    <span className="block text-[10px] text-slate-400 font-normal">{inv.admissionNo}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{inv.className}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">₦{inv.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-3 text-emerald-700 font-semibold">₦{inv.amountPaid.toLocaleString()}</td>
                  <td className="py-3 px-3 text-amber-700 font-semibold">₦{inv.balanceDue.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
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
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/admin/fees/invoices"
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
