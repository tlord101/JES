'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { feeStructuresStore, FeeCategory } from '@/lib/financeStore';

export default function AdminCreateFeeStructurePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [sessionVal, setSessionVal] = useState('2024/2025');
  const [term, setTerm] = useState('First Term');
  const [className, setClassName] = useState('SS 1 Blue');
  const [dueDate, setDueDate] = useState('2025-04-15');

  const [items, setItems] = useState<
    { category: FeeCategory; name: string; amount: number }[]
  >([
    { category: 'Tuition', name: 'Academic Tuition Fee', amount: 150000 },
    { category: 'Books', name: 'Textbooks & Course Materials', amount: 35000 },
    { category: 'Examination', name: 'CBT Examination Fee', amount: 15000 },
  ]);

  const addItem = () => {
    setItems([...items, { category: 'Other', name: 'New Fee Item', amount: 10000 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newStruct = {
      id: `fee-struct-${Date.now()}`,
      title,
      session: sessionVal,
      term,
      classId: className.toLowerCase().replace(/\s+/g, '-'),
      className,
      items,
      totalAmount,
      dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    feeStructuresStore.unshift(newStruct);
    router.push('/admin/fees/structures');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/fees/structures" className="text-xs text-blue-600 hover:underline">
            &larr; Back to Fee Schedules
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Create Fee Structure</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm space-y-6 text-xs">
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fee Schedule Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. SS1 Second Term Tuition & Development Fee Package"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Session</label>
              <select
                value={sessionVal}
                onChange={(e) => setSessionVal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
              >
                <option>2024/2025</option>
                <option>2025/2026</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
              >
                <option>First Term</option>
                <option>Second Term</option>
                <option>Third Term</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Class Level</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
              >
                <option>All Classes</option>
                <option>SS 1 Blue</option>
                <option>JSS 2 Gold</option>
                <option>Primary 5 Emerald</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs"
            />
          </div>
        </div>

        {/* FEE ITEM BREAKDOWN */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-900">Fee Item Breakdown</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg"
            >
              + Add Item
            </button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={item.category}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].category = e.target.value as FeeCategory;
                  setItems(updated);
                }}
                className="w-36 px-2 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option>Tuition</option>
                <option>Books</option>
                <option>Uniform</option>
                <option>Transportation</option>
                <option>Examination</option>
                <option>Activities</option>
                <option>Other</option>
              </select>

              <input
                type="text"
                value={item.name}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].name = e.target.value;
                  setItems(updated);
                }}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                placeholder="Item Description"
              />

              <input
                type="number"
                value={item.amount}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].amount = Number(e.target.value);
                  setItems(updated);
                }}
                className="w-28 px-3 py-2 border border-slate-200 rounded-xl text-xs text-right font-bold"
                placeholder="Amount (₦)"
              />

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          ))}

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center">
            <span className="font-bold text-blue-900">Calculated Total Fee Package:</span>
            <span className="text-lg font-extrabold text-blue-900">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Link
            href="/admin/fees/structures"
            className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
          >
            Save Fee Schedule
          </button>
        </div>
      </form>
    </div>
  );
}
