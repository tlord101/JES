'use client';

import { useState } from 'react';
import { subjectsStore } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

interface SchemeModule {
  id: string;
  subjectName: string;
  weekNumber: number;
  topic: string;
  objectives: string;
}

const INITIAL_SCHEMES: SchemeModule[] = [
  { id: 'sch_1', subjectName: 'Mathematics', weekNumber: 1, topic: 'Algebraic Expressions & Expansion', objectives: 'Understand expansion of binomial expressions and quadratic factorization.' },
  { id: 'sch_2', subjectName: 'Physics', weekNumber: 1, topic: 'Kinematics & Equations of Motion', objectives: 'Derive non-linear equations of motion and calculate velocity/acceleration.' },
  { id: 'sch_3', subjectName: 'Chemistry', weekNumber: 2, topic: 'Periodic Table & Periodicity', objectives: 'Analyze atomic radius trends, ionization energy, and electro-negativity.' },
];

export default function AdminCurriculumPage() {
  const [schemes, setSchemes] = useState<SchemeModule[]>(INITIAL_SCHEMES);
  const [showModal, setShowModal] = useState(false);

  const [subjectName, setSubjectName] = useState('Mathematics');
  const [weekNumber, setWeekNumber] = useState(1);
  const [topic, setTopic] = useState('');
  const [objectives, setObjectives] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    const newSch: SchemeModule = {
      id: `sch_${Date.now()}`,
      subjectName,
      weekNumber,
      topic,
      objectives,
    };

    setSchemes([...schemes, newSch]);
    logAuditEvent('Curriculum Module Added', 'System', `Added Week ${weekNumber} curriculum topic "${topic}" for ${subjectName}`);

    setTopic('');
    setObjectives('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Curriculum Standards & Scheme of Work</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Define termly weekly schemes of work, core learning objectives, and WAEC/NECO syllabus alignments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-book-half"></i>
          <span>Add Weekly Topic</span>
        </button>
      </div>

      <div className="space-y-3">
        {schemes.map((s) => (
          <div key={s.id} className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <span className="font-bold text-sm text-[var(--primary-dark)]">{s.subjectName}</span>
              <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded font-mono">
                Week {s.weekNumber}
              </span>
            </div>
            <div className="font-bold text-xs text-[var(--text)] pt-1">Topic: {s.topic}</div>
            <p className="text-slate-600 leading-relaxed">Objectives: {s.objectives}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Add Scheme of Work Entry</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full p-2 border border-[var(--border)] rounded font-bold"
                  >
                    {subjectsStore.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Week Number</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full p-2 border border-[var(--border)] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Lesson Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations and Formulas"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Specific Learning Objectives</label>
                <textarea
                  rows={3}
                  placeholder="Detailed learning objectives..."
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[var(--border)] font-bold rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
