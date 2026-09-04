'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resultsStore, StudentResult } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function PublishResultsPage() {
  const [results, setResults] = useState<StudentResult[]>([...resultsStore]);

  const approvedResults = results.filter((r) => r.status === 'Approved');

  const handlePublishAll = () => {
    approvedResults.forEach((r) => {
      r.status = 'Published';
    });
    setResults([...resultsStore]);
    logAuditEvent('Results Published', 'System', `Published ${approvedResults.length} approved term results to student portal`);
  };

  const handlePublishSingle = (id: string) => {
    const rec = resultsStore.find((r) => r.id === id);
    if (rec) {
      rec.status = 'Published';
      setResults([...resultsStore]);
      logAuditEvent('Result Published', 'System', `Published result for ${rec.studentName} (${rec.subjectName})`);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/admin/results" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Results Engine
          </Link>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">Portal Result Publishing Stage</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Publish approved results to make report sheets visible to parents and students. Students never see unpublished results.
          </p>
        </div>

        {approvedResults.length > 0 && (
          <button
            onClick={handlePublishAll}
            className="px-4 py-2 bg-green-700 text-white font-bold rounded hover:bg-green-800 transition-colors"
          >
            Publish All Approved Results ({approvedResults.length})
          </button>
        )}
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)]">
          Approved Results Ready for Portal Publishing ({approvedResults.length})
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Student Name</th>
              <th className="p-3">Class</th>
              <th className="p-3">Subject</th>
              <th className="p-3 font-bold">Total Score</th>
              <th className="p-3">Grade</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {approvedResults.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-[var(--muted-text)] font-semibold">
                  No approved results pending publication at this time.
                </td>
              </tr>
            ) : (
              approvedResults.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--soft-bg)]">
                  <td className="p-3 font-bold text-[var(--text)]">{r.studentName}</td>
                  <td className="p-3 text-[var(--muted-text)]">{r.className}</td>
                  <td className="p-3 font-semibold">{r.subjectName}</td>
                  <td className="p-3 font-mono font-black text-sm text-[var(--primary-dark)]">{r.totalScore}</td>
                  <td className="p-3 font-bold text-green-700">{r.grade}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handlePublishSingle(r.id)}
                      className="px-3 py-1 bg-green-700 text-white font-bold rounded hover:bg-green-800"
                    >
                      Publish Now
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
