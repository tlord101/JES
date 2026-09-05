'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function StudentExamStartPage() {
  const router = useRouter();
  const routeParams = useParams();
  const examId = (routeParams?.examId as string) || '';
  const [error, setError] = useState('');

  useEffect(() => {
    async function initSession() {
      if (!examId) return;
      try {
        const res = await fetch('/api/cbt/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examId,
            studentId: 'std-101',
            studentName: 'David Okafor',
          }),
        });

        const data = await res.json();
        if (res.ok && data.attempt) {
          sessionStorage.setItem('cbt_attempt', JSON.stringify(data.attempt));
          sessionStorage.setItem('cbt_questions', JSON.stringify(data.questions));
          sessionStorage.setItem('cbt_exam_title', data.examTitle || 'CBT Examination');
          router.replace(`/student/exams/${examId}/question/1`);
        } else {
          setError(data.error || 'Failed to start examination session.');
        }
      } catch {
        setError('Network error initializing exam session.');
      }
    }

    initSession();
  }, [examId, router]);

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-center space-y-3">
        <i className="bi bi-exclamation-triangle-fill text-3xl text-red-600"></i>
        <h1 className="font-bold text-base">Unable to Start Exam</h1>
        <p className="text-xs">{error}</p>
        <button
          onClick={() => router.push('/student/exams')}
          className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700"
        >
          Return to Exams List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h1 className="text-lg font-bold">Initializing Distraction-Free CBT Environment...</h1>
        <p className="text-xs text-slate-400">Loading question items and synchronizing server timer...</p>
      </div>
    </div>
  );
}
