import React from 'react';
import Link from 'next/link';
import { cbtExamsStore } from '@/lib/cbtStore';

export default function StudentExamsOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Computer-Based Tests (CBT)</h1>
          <p className="text-sm text-slate-500">Access scheduled continuous assessments and online term examinations.</p>
        </div>
        <Link
          href="/student/exams/results"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
        >
          My Past Results
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Available Test Papers</h2>
        <div className="space-y-4">
          {cbtExamsStore.map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                    {exam.className}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{exam.subject}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{exam.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Duration: {exam.durationMinutes} minutes • {exam.totalQuestions} Questions • Pass Mark: {exam.passMark}%
                </p>
              </div>

              <div>
                <Link
                  href={`/student/exams/${exam.id}/instructions`}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-block"
                >
                  Start Examination &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
