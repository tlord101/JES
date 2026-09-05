import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cbtExamsStore } from '@/lib/cbtStore';

export default async function StudentExamInstructionsPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const exam = cbtExamsStore.find((e) => e.id === examId);
  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm space-y-6">
        <div>
          <Link href="/student/exams" className="text-xs text-blue-600 hover:underline">
            &larr; Back to Available Exams
          </Link>
          <span className="block mt-2 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-md w-fit">
            {exam.className} • {exam.subject}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">{exam.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{exam.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Duration</span>
            <span className="font-bold text-slate-900 text-sm">{exam.durationMinutes} Minutes</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Total Items</span>
            <span className="font-bold text-slate-900 text-sm">{exam.totalQuestions} Questions</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Pass Mark</span>
            <span className="font-bold text-slate-900 text-sm">{exam.passMark}%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Attempts Allowed</span>
            <span className="font-bold text-slate-900 text-sm">{exam.attemptsAllowed} Attempt</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Important Candidate Instructions</h2>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
            <p>1. {exam.instructions}</p>
            <p>2. Continuous auto-save is enabled. Your responses are persisted to the server automatically as you navigate.</p>
            <p>3. Switching tabs, minimizing the browser window, or leaving the examination interface is logged in the security report.</p>
            <p>4. When timer expires, your test will automatically submit.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Link
            href="/student/exams"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <Link
            href={`/student/exams/${exam.id}/start`}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            I Agree, Start Exam Now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
