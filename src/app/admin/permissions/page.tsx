'use client';

import { PERMISSIONS } from '@/lib/rbac';

export default function AdminPermissionsPage() {
  const permList = Object.entries(PERMISSIONS);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Granular Permissions Index</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Comprehensive listing of atomic access permissions enforced by route authorization middleware.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Permission Identifier</th>
              <th className="p-3">Permission Code Token</th>
              <th className="p-3">Module Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] font-mono">
            {permList.map(([key, val]) => (
              <tr key={key} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{key}</td>
                <td className="p-3 text-blue-800 font-bold">{val}</td>
                <td className="p-3 text-[var(--muted-text)]">{val.split('.')[0].toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
