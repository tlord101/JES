import React from 'react';
import Link from 'next/link';
import { cbtExamsStore } from '@/lib/cbtStore';

export default function AdminExamsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Online CBT Examinations</h1>
          <p className="text-sm text-slate-500">Configure Computer-Based Tests, schedule windows, and monitor performance.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/question-bank"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Question Bank
          </Link>
          <Link
            href="/admin/exams/create"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i> Create Exam
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active & Scheduled CBT Papers</h2>
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
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">
                    {exam.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{exam.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Duration: {exam.durationMinutes} mins • Questions: {exam.totalQuestions} • Pass Mark: {exam.passMark}% • Attempts Allowed: {exam.attemptsAllowed}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/exams/${exam.id}/questions`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                >
                  Questions
                </Link>
                <Link
                  href={`/admin/exams/${exam.id}/settings`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                >
                  Settings
                </Link>
                <Link
                  href={`/admin/exams/${exam.id}/results`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                >
                  Results
                </Link>
                <Link
                  href={`/admin/exams/${exam.id}/analytics`}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
