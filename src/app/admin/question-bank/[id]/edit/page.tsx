'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cbtQuestionsPool } from '@/lib/cbtStore';

export default function AdminEditQuestionPage({ params }: { params: { id: string } }) {
  const q = cbtQuestionsPool.find((item) => item.id === params.id);
  if (!q) {
    notFound();
  }

  const [questionText, setQuestionText] = useState(q.question);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link href="/admin/question-bank" className="text-xs text-blue-600 hover:underline">
          &larr; Back to Question Bank
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Edit Question Item</h1>
        <p className="text-sm text-slate-500">Subject: {q.subject} • Topic: {q.topic}</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl">
          Question updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Question Text</label>
          <textarea
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link href="/admin/question-bank" className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl">
            Cancel
          </Link>
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-sm">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
