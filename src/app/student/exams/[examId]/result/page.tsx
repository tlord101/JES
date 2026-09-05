'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StudentExamResultPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('cbt_last_result');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-3">
          <h1 className="text-xl font-bold text-slate-900">Exam Submission Recorded</h1>
          <p className="text-xs text-slate-500">Your answers have been securely evaluated on the server.</p>
          <Link
            href="/student/exams/results"
            className="inline-block px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            View All Past CBT Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm space-y-6 text-center">
        <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold ${result.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          <i className={`bi ${result.passed ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
        </div>

        <div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${result.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {result.passed ? 'PASS' : 'FAIL'}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">CBT Result Summary</h1>
          <p className="text-xs text-slate-500">Submitted at {result.submittedAt || new Date().toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-500 block uppercase font-semibold">Total Score</span>
            <span className="text-2xl font-bold text-slate-900 mt-1">{result.score} / {result.maxPossibleMarks || 16}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-500 block uppercase font-semibold">Percentage</span>
            <span className={`text-2xl font-bold mt-1 ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
              {result.percentage}%
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-500 block uppercase font-semibold">Assessment Status</span>
            <span className="text-sm font-bold text-slate-800 mt-2 block">{result.passed ? 'Successful' : 'Needs Improvement'}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/student/exams"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Back to Available Exams
          </Link>
          <Link
            href="/student/exams/results"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            All CBT Results &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
