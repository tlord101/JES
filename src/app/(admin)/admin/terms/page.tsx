'use client';

import { useState } from 'react';
import { termsStore, AcademicTerm } from '@/lib/academicStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminTermsPage() {
  const [terms, setTerms] = useState<AcademicTerm[]>([...termsStore]);

  const handleSetCurrentTerm = (id: string) => {
    terms.forEach((t) => {
      t.isCurrent = t.id === id;
    });
    setTerms([...terms]);
    const active = terms.find((t) => t.id === id);
    logAuditEvent('Active Term Set', 'System', `Set active term to ${active?.termName}`);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Academic Terms Configuration</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Manage term cycles (First Term, Second Term, Third Term) and active term status for 2024/2025 session.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Term Name</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Current Active Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {terms.map((t) => (
              <tr key={t.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-sm text-[var(--primary-dark)]">{t.termName}</td>
                <td className="p-3 font-mono font-semibold text-[var(--text)]">{t.startDate}</td>
                <td className="p-3 font-mono font-semibold text-[var(--text)]">{t.endDate}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded ${
                      t.isCurrent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {t.isCurrent ? 'Active Current Term' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {!t.isCurrent && (
                    <button
                      onClick={() => handleSetCurrentTerm(t.id)}
                      className="px-3 py-1 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
                    >
                      Set Active
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
