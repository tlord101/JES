'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resultsStore, StudentResult } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function ApproveResultsPage() {
  const [results, setResults] = useState<StudentResult[]>([...resultsStore]);

  const reviewedResults = results.filter((r) => r.status === 'Reviewed');

  const handleApprove = (id: string) => {
    const rec = resultsStore.find((r) => r.id === id);
    if (rec) {
      rec.status = 'Approved';
      setResults([...resultsStore]);
      logAuditEvent('Result Approved', 'System', `Principal approved result for ${rec.studentName} (${rec.subjectName})`);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/results" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Results Engine
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Principal Approval Stage</h1>
          <p className="text-xs text-[var(--muted-text)]">Review HOD-approved scores and grant official Principal sign-off.</p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)]">
          Reviewed Results Awaiting Principal Approval ({reviewedResults.length})
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Student Name</th>
              <th className="p-3">Subject</th>
              <th className="p-3">CA (30)</th>
              <th className="p-3">Exam (70)</th>
              <th className="p-3 font-bold">Total</th>
              <th className="p-3">Grade</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {reviewedResults.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[var(--muted-text)] font-semibold">
                  No reviewed score entries currently awaiting Principal approval.
                </td>
              </tr>
            ) : (
              reviewedResults.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--soft-bg)]">
                  <td className="p-3 font-bold text-[var(--text)]">{r.studentName}</td>
                  <td className="p-3 font-semibold">{r.subjectName}</td>
                  <td className="p-3 font-mono">{r.caScore}</td>
                  <td className="p-3 font-mono">{r.examScore}</td>
                  <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{r.totalScore}</td>
                  <td className="p-3 font-bold text-green-700">{r.grade}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="px-3 py-1 bg-amber-600 text-white font-bold rounded hover:bg-amber-700"
                    >
                      Approve Result
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
