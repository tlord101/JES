'use client';

import { auditLogsStore } from '@/lib/auditStore';

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">System Audit & Compliance Logs</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Real-time immutable audit trail tracking administrator operations, user creation, grade submissions, and CMS publishes.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Action Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Event Details</th>
              <th className="p-3">Performed By</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {auditLogsStore.map((log) => (
              <tr key={log.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{log.action}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-mono font-bold text-[10px] rounded">
                    {log.category}
                  </span>
                </td>
                <td className="p-3 text-[var(--text)]">{log.details}</td>
                <td className="p-3 font-medium text-[var(--text)]">
                  {log.userName}
                  <span className="text-[10px] text-[var(--muted-text)] font-mono block">{log.userEmail}</span>
                </td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{log.timestamp.replace('T', ' ').substring(0, 19)}</td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{log.ip || '127.0.0.1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
