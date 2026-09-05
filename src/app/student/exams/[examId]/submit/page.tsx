'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function StudentExamSubmitConfirmPage() {
  const router = useRouter();
  const routeParams = useParams();
  const examId = (routeParams?.examId as string) || '';

  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedAttempt = sessionStorage.getItem('cbt_attempt');
    const storedQuestions = sessionStorage.getItem('cbt_questions');

    if (storedAttempt && storedQuestions) {
      setAttempt(JSON.parse(storedAttempt));
      setQuestions(JSON.parse(storedQuestions));
    } else {
      if (examId) {
        router.replace(`/student/exams/${examId}/instructions`);
      }
    }
  }, [examId, router]);

  if (!attempt) return null;

  const answeredCount = Object.keys(attempt.answers || {}).length;
  const totalQuestions = questions.length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = (attempt.markedForReview || []).length;

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/cbt/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attempt.id }),
      });

      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem('cbt_last_result', JSON.stringify(data));
        router.replace(`/student/exams/${examId}/result`);
      } else {
        alert(data.error || 'Submission failed');
        setSubmitting(false);
      }
    } catch {
      alert('Network error submitting exam.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 lg:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600/20 border border-blue-500 text-blue-400 rounded-2xl flex items-center justify-center text-xl mx-auto">
            <i className="bi bi-file-earmark-check-fill"></i>
          </div>
          <h1 className="text-xl font-bold text-white">Confirm Examination Submission</h1>
          <p className="text-xs text-slate-400">
            Please review your completion status before finalizing your test paper.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Answered</span>
            <span className="text-lg font-bold text-emerald-400">{answeredCount}</span>
          </div>
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Flagged</span>
            <span className="text-lg font-bold text-amber-400">{flaggedCount}</span>
          </div>
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Unanswered</span>
            <span className="text-lg font-bold text-red-400">{unansweredCount}</span>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="p-3 bg-red-950/30 border border-red-800/40 text-red-300 text-xs rounded-xl flex items-center gap-2 font-medium">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-base"></i>
            <span>You have {unansweredCount} unanswered question(s). You can return to answer them.</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push(`/student/exams/${examId}/question/1`)}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Return to Questions
          </button>
          <button
            onClick={handleConfirmSubmit}
            disabled={submitting}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Finalizing...' : 'Submit Exam Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
