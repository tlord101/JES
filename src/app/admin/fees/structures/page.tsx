'use client';

import React from 'react';
import Link from 'next/link';
import { feeStructuresStore } from '@/lib/financeStore';

export default function AdminFeeStructuresPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Structures & Schedules</h1>
          <p className="text-sm text-slate-500">Configure tuition, books, uniform, CBT, and activity fee templates by term and class level.</p>
        </div>
        <Link
          href="/admin/fees/structures/create"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-plus-lg"></i> Create New Fee Schedule
        </Link>
      </div>

      <div className="space-y-4">
        {feeStructuresStore.map((struct) => (
          <div key={struct.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-3 gap-2">
              <div>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">
                  {struct.className} • {struct.session} ({struct.term})
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">{struct.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Package Fee</span>
                <span className="text-xl font-extrabold text-blue-900">₦{struct.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {struct.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.category}</span>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">₦{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
              <span>Due Date: <strong className="text-slate-700">{struct.dueDate}</strong></span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg">
                  Edit Template
                </button>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg">
                  Generate Student Invoices
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
