'use client';

import { useActionState, useMemo, useState } from 'react';
import { initialAuthState } from '@/lib/auth/action-state';
import { saveResultsAction, submitResultsAction } from '@/lib/academics/actions';
import type { GradebookEntry } from '@/lib/data/academics';

const CA1_MAX = 20;
const CA2_MAX = 20;
const EXAM_MAX = 60;

/** Mirrors public.grade_for_score / public.remark_for_grade in the database. */
function gradeFor(total: number): { grade: string; remark: string } {
  if (total >= 75) return { grade: 'A', remark: 'Excellent' };
  if (total >= 65) return { grade: 'B', remark: 'Very Good' };
  if (total >= 55) return { grade: 'C', remark: 'Good' };
  if (total >= 45) return { grade: 'D', remark: 'Fair' };
  if (total >= 40) return { grade: 'E', remark: 'Pass' };
  return { grade: 'F', remark: 'Needs Improvement' };
}

type Scores = Record<string, { ca1: string; ca2: string; exam: string }>;

export default function GradebookForm({
  classId,
  className,
  subjectId,
  subjectName,
  termId,
  termName,
  entries,
}: {
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  termId: string;
  termName: string;
  entries: GradebookEntry[];
}) {
  const [saveState, saveAction, isSaving] = useActionState(saveResultsAction, initialAuthState);
  const [submitState, submitAction, isSubmitting] = useActionState(
    submitResultsAction,
    initialAuthState
  );

  const [scores, setScores] = useState<Scores>(() =>
    Object.fromEntries(
      entries.map((entry) => [
        entry.studentId,
        {
          ca1: entry.status === 'not-entered' ? '' : String(entry.ca1Score),
          ca2: entry.status === 'not-entered' ? '' : String(entry.ca2Score),
          exam: entry.status === 'not-entered' ? '' : String(entry.examScore),
        },
      ])
    )
  );

  const update = (studentId: string, field: 'ca1' | 'ca2' | 'exam', value: string) =>
    setScores((previous) => ({
      ...previous,
      [studentId]: { ...previous[studentId], [field]: value },
    }));

  const summary = useMemo(() => {
    const totals = entries.map((entry) => {
      const row = scores[entry.studentId];
      return (
        Number(row?.ca1 || 0) + Number(row?.ca2 || 0) + Number(row?.exam || 0)
      );
    });
    if (totals.length === 0) return { average: 0, entered: 0 };
    const entered = entries.filter((entry) => entry.status !== 'not-entered').length;
    const average = Math.round((totals.reduce((sum, total) => sum + total, 0) / totals.length) * 100) / 100;
    return { average, entered };
  }, [entries, scores]);

  const states = [saveState, submitState].filter((state) => state.status !== 'idle');

  return (
    <div className="space-y-4">
      {states.map((state, index) => (
        <div
          key={`${state.status}-${index}`}
          className={`p-3 text-xs rounded font-bold ${
            state.status === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {state.message}
        </div>
      ))}

      <form action={saveAction} className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <input type="hidden" name="classId" value={classId} />
        <input type="hidden" name="subjectId" value={subjectId} />
        <input type="hidden" name="termId" value={termId} />
        <input type="hidden" name="studentIds" value={entries.map((entry) => entry.studentId).join(',')} />

        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[var(--primary-dark)]">
              {subjectName} — {className}
            </h2>
            <p className="text-[11px] text-[var(--muted-text)]">
              {termName} · {entries.length} students · {summary.entered} already recorded
            </p>
          </div>
          <div className="text-[11px] font-bold text-[var(--primary)]">
            Live class average: {summary.average}
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="p-6 text-[var(--muted-text)]">
            This class has no active students yet. Enrol learners before recording scores.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                  <th className="p-3">Student</th>
                  <th className="p-3">CA1 / {CA1_MAX}</th>
                  <th className="p-3">CA2 / {CA2_MAX}</th>
                  <th className="p-3">Exam / {EXAM_MAX}</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {entries.map((entry) => {
                  const row = scores[entry.studentId] ?? { ca1: '', ca2: '', exam: '' };
                  const total =
                    Number(row.ca1 || 0) + Number(row.ca2 || 0) + Number(row.exam || 0);
                  const { grade, remark } = gradeFor(total);

                  return (
                    <tr key={entry.studentId} className="hover:bg-[var(--soft-bg)]">
                      <td className="p-3">
                        <div className="font-bold text-[var(--text)]">{entry.fullName}</div>
                        <div className="font-mono text-[11px] text-[var(--muted-text)]">
                          {entry.admissionNo}
                          {entry.status !== 'not-entered' && (
                            <span className="ml-2 uppercase font-bold text-[var(--primary)]">
                              {entry.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name={`ca1_${entry.studentId}`}
                          value={row.ca1}
                          min={0}
                          max={CA1_MAX}
                          step="0.5"
                          onChange={(event) => update(entry.studentId, 'ca1', event.target.value)}
                          className="w-20 p-2 border border-[var(--border)] rounded font-mono font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name={`ca2_${entry.studentId}`}
                          value={row.ca2}
                          min={0}
                          max={CA2_MAX}
                          step="0.5"
                          onChange={(event) => update(entry.studentId, 'ca2', event.target.value)}
                          className="w-20 p-2 border border-[var(--border)] rounded font-mono font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          name={`exam_${entry.studentId}`}
                          value={row.exam}
                          min={0}
                          max={EXAM_MAX}
                          step="0.5"
                          onChange={(event) => update(entry.studentId, 'exam', event.target.value)}
                          className="w-20 p-2 border border-[var(--border)] rounded font-mono font-bold"
                        />
                      </td>
                      <td className="p-3 text-center font-mono font-extrabold text-[var(--primary-dark)]">
                        {Math.round(total * 100) / 100}
                      </td>
                      <td className="p-3 text-center font-bold">{grade}</td>
                      <td className="p-3 text-[var(--muted-text)]">{remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-[var(--soft-bg)] border-t border-[var(--border)] flex justify-end">
          <button
            type="submit"
            disabled={isSaving || entries.length === 0}
            className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save draft scores'}
          </button>
        </div>
      </form>

      <form
        action={submitAction}
        className="bg-white p-4 border border-[var(--border)] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <input type="hidden" name="classId" value={classId} />
        <input type="hidden" name="subjectId" value={subjectId} />
        <input type="hidden" name="termId" value={termId} />
        <div>
          <p className="font-bold text-[var(--text)]">Submit this gradebook for review</p>
          <p className="text-[11px] text-[var(--muted-text)]">
            Every draft score for {subjectName} in {className} moves to the submitted queue where the head of
            department and the principal review it before publishing.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-[var(--primary-dark)] text-white font-bold rounded hover:bg-[var(--primary)] disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting…' : 'Submit for review'}
        </button>
      </form>
    </div>
  );
}
