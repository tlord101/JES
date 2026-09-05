import React from 'react';
import Link from 'next/link';
import { mockStaffExams } from '@/lib/staffData';

export default function StaffExamsOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CBT & Examinations</h1>
          <p className="text-sm text-slate-500">Configure Computer-Based Tests, link question items, and track exam submissions.</p>
        </div>
        <Link
          href="/staff/exams/create"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <i className="bi bi-plus-circle"></i> Create CBT Exam
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Scheduled & Completed Exams</h2>
        <div className="space-y-4">
          {mockStaffExams.map((exam) => (
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
                  Scheduled Date: {exam.date} • Duration: {exam.durationMinutes} mins • {exam.questionIds.length} Linked Questions ({exam.totalMarks} Marks)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/staff/exams/${exam.id}/questions`}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Edit Questions
                </Link>
                <Link
                  href={`/staff/exams/${exam.id}/results`}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Exam Analytics
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
