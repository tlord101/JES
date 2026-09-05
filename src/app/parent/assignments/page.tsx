'use client';

import { useState } from 'react';
import { defaultParentAssignments, defaultWards } from '@/lib/parentData';

export default function ParentAssignmentsPage() {
  const [selectedWardId, setSelectedWardId] = useState<string>('All');

  const filteredAssignments = selectedWardId === 'All'
    ? defaultParentAssignments
    : defaultParentAssignments.filter((a) => a.wardId === selectedWardId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Academic Tasks
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Wards' Course Assignments
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Monitor homework tasks, deadlines, submission status, grades, and teacher feedback.
          </p>
        </div>
      </div>

      {/* Ward Filter */}
      <div className="bg-white p-2 border border-[var(--border)] rounded flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setSelectedWardId('All')}
          className={`px-3 py-2 rounded transition-colors ${
            selectedWardId === 'All'
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--text)] hover:bg-[var(--soft-bg)]'
          }`}
        >
          All Wards ({defaultParentAssignments.length})
        </button>

        {defaultWards.map((w) => {
          const count = defaultParentAssignments.filter((a) => a.wardId === w.id).length;

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

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-xs text-[var(--muted-text)]">
            No assignments recorded for the selected filter.
          </div>
        ) : (
          filteredAssignments.map((asg) => (
            <div key={asg.id} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                      {asg.wardName}
                    </span>
                    <span className="text-xs font-bold text-[var(--primary)]">{asg.subjectName}</span>
                  </div>
                  <h2 className="text-base font-extrabold text-[var(--primary-dark)] mt-1">{asg.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                    asg.status === 'Graded' ? 'bg-green-100 text-green-800' :
                    asg.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {asg.status}
                  </span>
                  {asg.grade !== undefined && (
                    <span className="px-2.5 py-0.5 bg-green-700 text-white font-black text-xs rounded">
                      Score: {asg.grade}/{asg.totalMarks}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-[var(--muted-text)]">
                Deadline: <strong className="text-[var(--primary-dark)]">{asg.dueDate}</strong> • Total Points: {asg.totalMarks}
              </div>

              {asg.teacherFeedback && (
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-xs italic space-y-1">
                  <span className="font-bold text-[var(--primary-dark)] not-italic block text-[11px]">Teacher Feedback:</span>
                  <p>"{asg.teacherFeedback}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
