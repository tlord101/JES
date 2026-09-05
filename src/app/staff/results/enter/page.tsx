'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockDraftResults } from '@/lib/staffData';

export default function StaffEnterResultsPage() {
  const [results, setResults] = useState(mockDraftResults);
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleScoreChange = (index: number, field: 'ca1' | 'ca2' | 'exam', val: number) => {
    const updated = [...results];
    updated[index][field] = Math.max(0, val);
    setResults(updated);
  };

  const handleRemarkChange = (index: number, val: string) => {
    const updated = [...results];
    updated[index].teacherRemark = val;
    setResults(updated);
  };

  const handleSubmitForReview = async () => {
    setSubmitting(true);
    setMsg('');

    try {
      const res = await fetch('/api/staff/results/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
      } else {
        setMsg('Failed to submit results for review.');
      }
    } catch {
      setMsg('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/staff/results" className="text-xs text-blue-600 hover:underline">
            &larr; Back to Results Overview
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Batch Result Entry Sheet</h1>
          <p className="text-sm text-slate-500">SS 1 Blue • Subject: Mathematics • First Term 2024/2025</p>
        </div>
        <button
          type="button"
          onClick={handleSubmitForReview}
          disabled={submitting}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit for Admin Review'}
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl">
          {msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3 w-24">CA 1 (20)</th>
                <th className="py-2.5 px-3 w-24">CA 2 (20)</th>
                <th className="py-2.5 px-3 w-24">Exam (60)</th>
                <th className="py-2.5 px-3 w-24">Total</th>
                <th className="py-2.5 px-3">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r, idx) => {
                const total = Number(r.ca1 || 0) + Number(r.ca2 || 0) + Number(r.exam || 0);
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        max={20}
                        min={0}
                        value={r.ca1}
                        onChange={(e) => handleScoreChange(idx, 'ca1', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold outline-none"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        max={20}
                        min={0}
                        value={r.ca2}
                        onChange={(e) => handleScoreChange(idx, 'ca2', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold outline-none"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        max={60}
                        min={0}
                        value={r.exam}
                        onChange={(e) => handleScoreChange(idx, 'exam', Number(e.target.value))}
                        className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold outline-none"
                      />
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-700">{total}</td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={r.teacherRemark}
                        onChange={(e) => handleRemarkChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-medium outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
