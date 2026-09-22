'use client';

import { useActionState, useState } from 'react';
import { initialAuthState } from '@/lib/auth/action-state';
import { saveAttendanceAction } from '@/lib/academics/actions';
import type { AttendanceRegisterEntry } from '@/lib/data/academics';
import type { AttendanceStatus } from '@/types/database';

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; active: string }[] = [
  { value: 'present', label: 'Present', active: 'bg-green-600 text-white border-green-600' },
  { value: 'absent', label: 'Absent', active: 'bg-red-600 text-white border-red-600' },
  { value: 'late', label: 'Late', active: 'bg-amber-500 text-white border-amber-500' },
  { value: 'excused', label: 'Excused', active: 'bg-blue-600 text-white border-blue-600' },
];

export default function AttendanceForm({
  classId,
  className,
  attendanceDate,
  termId,
  entries,
}: {
  classId: string;
  className: string;
  attendanceDate: string;
  termId: string;
  entries: AttendanceRegisterEntry[];
}) {
  const [state, formAction, isPending] = useActionState(saveAttendanceAction, initialAuthState);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(
      entries.map((entry) => [entry.studentId, entry.status === 'unmarked' ? 'present' : entry.status])
    )
  );

  const setAll = (status: AttendanceStatus) =>
    setStatuses(Object.fromEntries(entries.map((entry) => [entry.studentId, status])));

  return (
    <form action={formAction} className="bg-white border border-[var(--border)] rounded overflow-hidden">
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="attendanceDate" value={attendanceDate} />
      <input type="hidden" name="termId" value={termId} />

      <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[var(--primary-dark)]">
            {className} — daily register
          </h2>
          <p className="text-[11px] text-[var(--muted-text)]">{entries.length} students on roll</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[var(--muted-text)]">Mark all:</span>
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAll(option.value)}
              className="px-3 py-1 border border-[var(--border)] rounded text-[11px] font-bold hover:bg-[var(--soft-bg)]"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {state.status !== 'idle' && (
        <div
          className={`p-3 m-4 text-xs rounded font-bold ${
            state.status === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="p-6 text-[var(--muted-text)]">
          This class has no active students. Enrol students in the administration portal first.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold border-b border-[var(--border)]">
                <th className="p-3">Admission No</th>
                <th className="p-3">Student</th>
                <th className="p-3">Status</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {entries.map((entry) => {
                const current = statuses[entry.studentId] ?? 'present';
                return (
                  <tr key={entry.studentId} className="hover:bg-[var(--soft-bg)]">
                    <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">
                      {entry.admissionNo}
                    </td>
                    <td className="p-3 font-bold text-[var(--text)]">{entry.fullName}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            className={`px-2.5 py-1 border rounded text-[11px] font-bold cursor-pointer ${
                              current === option.value
                                ? option.active
                                : 'bg-white text-[var(--text)] border-[var(--border)] hover:bg-[var(--soft-bg)]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`status_${entry.studentId}`}
                              value={option.value}
                              checked={current === option.value}
                              onChange={() =>
                                setStatuses((previous) => ({ ...previous, [entry.studentId]: option.value }))
                              }
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        name={`remarks_${entry.studentId}`}
                        defaultValue={entry.remarks ?? ''}
                        placeholder="Optional"
                        className="w-full p-2 border border-[var(--border)] rounded"
                      />
                    </td>
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
          disabled={isPending || entries.length === 0}
          className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Save register'}
        </button>
      </div>
    </form>
  );
}
