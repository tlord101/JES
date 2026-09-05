import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cbtExamsStore } from '@/lib/cbtStore';

export default function AdminExamAnalyticsPage({ params }: { params: { id: string } }) {
  const exam = cbtExamsStore.find((e) => e.id === params.id);
  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <Link href={`/admin/exams/${exam.id}`} className="text-xs text-blue-600 hover:underline">
          &larr; Back to Exam
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">{exam.title} Item Analytics</h1>
        <p className="text-sm text-slate-500">
          In-depth assessment diagnostics, pass/fail ratios, and most-missed questions.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Mean Class Score</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">79.2%</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Pass Rate</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">94.7%</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Highest / Lowest</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">93.8% / 56.3%</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Completed Attempts</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">38 Submissions</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">Question Item Difficulty & Miss Rate</h2>
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <div className="font-bold text-slate-900">Q7: Definite Integration ∫ from 0 to 2 of 3x² dx</div>
              <div className="text-slate-500">Topic: Integration • Difficulty: Hard</div>
            </div>
            <span className="px-2.5 py-1 bg-red-100 text-red-800 font-bold rounded-lg">
              34.2% Miss Rate (Most Missed)
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center bg-slate-50">
            <div>
              <div className="font-bold text-slate-900">Q1: Solve for x in 2x² - 8 = 0</div>
              <div className="text-slate-500">Topic: Quadratic Equations • Difficulty: Medium</div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg">
              5.2% Miss Rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
