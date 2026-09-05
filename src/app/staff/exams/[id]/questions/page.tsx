'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockStaffExams, mockQuestionBank } from '@/lib/staffData';

export default function StaffExamQuestionsPage({ params }: { params: { id: string } }) {
  const exam = mockStaffExams.find((e) => e.id === params.id);
  if (!exam) {
    notFound();
  }

  const [selectedIds, setSelectedIds] = useState<string[]>(exam.questionIds);
  const [savedMsg, setSavedMsg] = useState('');

  const toggleQuestion = (qId: string) => {
    if (selectedIds.includes(qId)) {
      setSelectedIds(selectedIds.filter((id) => id !== qId));
    } else {
      setSelectedIds([...selectedIds, qId]);
    }
  };

  const handleSave = () => {
    setSavedMsg(`Updated exam questions. ${selectedIds.length} question(s) attached!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/staff/exams" className="text-xs text-blue-600 hover:underline">
            &larr; Back to CBT Exams
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{exam.title}</h1>
          <p className="text-sm text-slate-500">
            Link question bank items to this CBT paper • Class: {exam.className}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
        >
          Save Linked Questions ({selectedIds.length})
        </button>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl">
          {savedMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Available Question Items</h2>
        <div className="space-y-3">
          {mockQuestionBank.map((q) => {
            const isAttached = selectedIds.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => toggleQuestion(q.id)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-colors flex items-start gap-3 ${
                  isAttached
                    ? 'border-blue-600 bg-blue-50/50 font-medium'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isAttached}
                  onChange={() => {}}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded uppercase">
                      {q.type.replace('_', ' ')}
                    </span>
                    <span className="text-slate-500 font-semibold">{q.subject} • {q.topic}</span>
                    <span className="ml-auto font-bold text-blue-700">{q.marks} Marks</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{q.question}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
