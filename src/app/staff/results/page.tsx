import React from 'react';
import Link from 'next/link';
import { mockDraftResults } from '@/lib/staffData';

export default function StaffResultsOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Term Academic Results Entry</h1>
          <p className="text-sm text-slate-500">
            Enter CA and Exam scores, review drafts, and submit to Admin for final approval.
          </p>
        </div>
        <Link
          href="/staff/results/enter"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <i className="bi bi-pencil-square"></i> Enter Class BroadSheet
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 font-medium">
        <i className="bi bi-shield-lock-fill text-amber-600 text-sm mr-1.5"></i>
        <strong>Result Publishing Rule:</strong> Entered marks remain as drafts or in 'Pending Review' status until verified and published by the School Principal / Admin. Direct auto-publishing is restricted.
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Draft Broadsheet Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">CA 1 (20)</th>
                <th className="py-2.5 px-3">CA 2 (20)</th>
                <th className="py-2.5 px-3">Exam (60)</th>
                <th className="py-2.5 px-3">Total (100)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDraftResults.map((r, i) => {
                const total = r.ca1 + r.ca2 + r.exam;
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-3 px-3 text-slate-600">{r.subject}</td>
                    <td className="py-3 px-3 text-slate-700">{r.ca1}</td>
                    <td className="py-3 px-3 text-slate-700">{r.ca2}</td>
                    <td className="py-3 px-3 text-slate-700">{r.exam}</td>
                    <td className="py-3 px-3 font-bold text-blue-700">{total}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/staff/results/${r.studentId}`}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit Score
                      </Link>
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
