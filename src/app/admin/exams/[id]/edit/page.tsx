import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cbtExamsStore } from '@/lib/cbtStore';

export default function AdminEditExamPage({ params }: { params: { id: string } }) {
  const exam = cbtExamsStore.find((e) => e.id === params.id);
  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link href={`/admin/exams/${exam.id}`} className="text-xs text-blue-600 hover:underline">
          &larr; Back to Exam Detail
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Edit Exam Configuration</h1>
        <p className="text-sm text-slate-500">Update parameters for {exam.title}.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Exam Title</label>
          <input
            type="text"
            defaultValue={exam.title}
            className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Duration (Mins)</label>
            <input
              type="number"
              defaultValue={exam.durationMinutes}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pass Mark (%)</label>
            <input
              type="number"
              defaultValue={exam.passMark}
              className="w-full px-3 py-2 border rounded-xl font-medium outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link
            href={`/admin/exams/${exam.id}`}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm"
          >
            Update Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
