'use client';

import { ROLE_PERMISSIONS } from '@/lib/rbac';
import { UserType } from '@/lib/db';

const ROLES_LIST: UserType[] = [
  'Super Admin',
  'Administrator',
  'Principal',
  'Vice Principal',
  'HOD',
  'Teacher',
  'Accountant',
  'Parent',
  'Student',
  'Alumni',
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Role Definitions & RBAC Architecture</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Overview of the 10 role categories and assigned capabilities in Jasmine Exclusive School.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES_LIST.map((role) => {
          const perms = ROLE_PERMISSIONS[role] || [];
          return (
            <div key={role} className="bg-white p-5 border border-[var(--border)] rounded space-y-3">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                <span className="font-bold text-sm text-[var(--primary-dark)]">{role}</span>
                <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[10px] font-mono font-bold rounded">
                  {perms.length} Permissions
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {perms.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 bg-[var(--soft-bg)] border border-[var(--border)] font-mono text-[10px] text-[var(--text)] rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
