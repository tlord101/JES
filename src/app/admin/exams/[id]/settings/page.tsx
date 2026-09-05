import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cbtExamsStore } from '@/lib/cbtStore';

export default function AdminExamSettingsPage({ params }: { params: { id: string } }) {
  const exam = cbtExamsStore.find((e) => e.id === params.id);
  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link href={`/admin/exams/${exam.id}`} className="text-xs text-blue-600 hover:underline">
          &larr; Back to Exam
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Advanced Exam Security & Settings</h1>
        <p className="text-sm text-slate-500">Configure anti-cheating protocols and auto-save options.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
          <div className="font-bold text-slate-900 text-sm">Anti-Cheating Detection Protocols</div>
          <div className="space-y-1.5 text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Log Tab-Switch / Window Blur Events</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Enforce Distraction-Free Fullscreen Mode</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span>Enforce Server-Side Time Expiry Auto-Submission</span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
          <div className="font-bold text-slate-900 text-sm">Offline Auto-Save & Synchronization</div>
          <p className="text-slate-600">
            Answers are persisted continuously to local browser storage and synchronized server-side via persistent API handlers.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm"
          >
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
}
