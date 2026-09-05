'use client';

import { useState } from 'react';
import { defaultParentExams, defaultWards } from '@/lib/parentData';

export default function ParentExamsPage() {
  const [selectedWardId, setSelectedWardId] = useState<string>('All');

  const filteredExams = selectedWardId === 'All'
    ? defaultParentExams
    : defaultParentExams.filter((e) => e.wardId === selectedWardId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            CBT Assessments
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Wards' CBT Examinations & Scores
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Read-only overview of upcoming CBT dates and completed assessment scores.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded flex items-center gap-1.5">
          <i className="bi bi-shield-lock-fill text-slate-500"></i>
          <span>Parent Read-Only Mode</span>
        </div>
      </div>

      {/* Ward Selector */}
      <div className="bg-white p-2 border border-[var(--border)] rounded flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setSelectedWardId('All')}
          className={`px-3 py-2 rounded transition-colors ${
            selectedWardId === 'All'
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--text)] hover:bg-[var(--soft-bg)]'
          }`}
        >
          All Wards ({defaultParentExams.length})
        </button>

        {defaultWards.map((w) => {
          const count = defaultParentExams.filter((e) => e.wardId === w.id).length;

          return (
            <button
              key={w.id}
              onClick={() => setSelectedWardId(w.id)}
              className={`px-3 py-2 rounded transition-colors flex items-center gap-1.5 ${
                selectedWardId === w.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text)] hover:bg-[var(--soft-bg)]'
              }`}
            >
              <span>{w.name}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                selectedWardId === w.id ? 'bg-white text-[var(--primary-dark)]' : 'bg-slate-100 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                    {exam.wardName}
                  </span>
                  <span className="text-xs font-bold text-[var(--primary)]">{exam.subjectName}</span>
                </div>
                <h2 className="text-base font-extrabold text-[var(--primary-dark)] mt-1">{exam.title}</h2>
              </div>

              <div>
                {exam.status === 'Completed' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-900 font-extrabold text-xs rounded">
                    Score: {exam.scoreObtained}/{exam.totalMarks} ({exam.percentage}%)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded">
                    Scheduled for {exam.examDate}
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs text-[var(--muted-text)]">
              Exam Date: <strong className="text-[var(--primary-dark)]">{exam.examDate}</strong> • Allocation: {exam.totalMarks} Points
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
