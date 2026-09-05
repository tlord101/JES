'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cbtQuestionsPool, CBTQuestion } from '@/lib/cbtStore';

export default function AdminQuestionBankPage() {
  const [questions, setQuestions] = useState<CBTQuestion[]>(cbtQuestionsPool);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master CBT Question Bank</h1>
          <p className="text-sm text-slate-500">Centralized question repository for automated exam paper generation.</p>
        </div>
        <Link
          href="/admin/question-bank/create"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
        >
          <i className="bi bi-plus-lg"></i> Create Question Item
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">All Question Items ({questions.length})</h2>
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">
                    {q.type.replace('_', ' ')}
                  </span>
                  <span className="font-semibold text-slate-600">{q.subject} • {q.topic}</span>
                </div>
                <Link
                  href={`/admin/question-bank/${q.id}/edit`}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 border rounded-lg text-slate-700 font-semibold"
                >
                  Edit Question
                </Link>
              </div>
              <div className="font-bold text-slate-900 text-sm">{q.question}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
