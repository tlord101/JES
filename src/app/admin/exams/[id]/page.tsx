import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cbtExamsStore } from '@/lib/cbtStore';

export default function AdminExamDetailPage({ params }: { params: { id: string } }) {
  const exam = cbtExamsStore.find((e) => e.id === params.id);
  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <Link href="/admin/exams" className="text-xs text-blue-600 hover:underline">
          &larr; Back to Examinations
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
              {exam.className} • {exam.subject}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{exam.title}</h1>
            <p className="text-xs text-slate-500 mt-1">{exam.description}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/exams/${exam.id}/edit`}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
            >
              Edit Config
            </Link>
            <Link
              href={`/admin/exams/${exam.id}/analytics`}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase">Duration & Rules</div>
          <div className="text-base font-bold text-slate-900">{exam.durationMinutes} Minutes</div>
          <div className="text-xs text-slate-600">Pass Mark: {exam.passMark}% • Attempts Allowed: {exam.attemptsAllowed}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase">Question Pool</div>
          <div className="text-base font-bold text-slate-900">{exam.questionIds.length} Linked Questions</div>
          <div className="text-xs text-slate-600">Randomization: {exam.randomizeQuestions ? 'Enabled' : 'Disabled'}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase">Active Schedule Window</div>
          <div className="text-sm font-bold text-slate-900">{exam.startDate.slice(0, 10)} to {exam.endDate.slice(0, 10)}</div>
          <div className="text-xs text-emerald-600 font-semibold">Status: {exam.status.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}
