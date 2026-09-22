import type { UserRole } from '@/types/database';
import {
  ALL_ROLES,
  ROLE_LABELS,
  ROLE_HOME,
  canAccessStaffPortal,
  canManageContent,
  canManageFinance,
} from '@/lib/auth/roles';

/** Capability summary derived from the RBAC helpers in `@/lib/auth/roles`. */
function capabilitiesFor(role: UserRole): string[] {
  const caps: string[] = [];
  if (role === 'super_admin' || role === 'admin') caps.push('users.manage', 'settings.manage');
  if (canManageContent(role)) caps.push('cms.manage', 'admissions.review', 'results.approve');
  if (canManageFinance(role)) caps.push('finance.manage', 'payments.record');
  if (canAccessStaffPortal(role)) caps.push('attendance.mark', 'results.enter');
  if (role === 'parent') caps.push('children.view', 'fees.view', 'payments.make');
  if (role === 'student') caps.push('results.view', 'attendance.view', 'assignments.view');
  if (role === 'alumni') caps.push('alumni.directory');
  return caps;
}

export const metadata = { title: 'Roles & Permissions | JES Admin' };

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Role Definitions &amp; RBAC Architecture</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Overview of the 10 role categories and their portal landing pages in Jasmine Exclusive School.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_ROLES.map((role) => {
          const caps = capabilitiesFor(role);
          return (
            <div key={role} className="bg-white p-5 border border-[var(--border)] rounded space-y-3">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                <span className="font-bold text-sm text-[var(--primary-dark)]">{ROLE_LABELS[role]}</span>
                <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[10px] font-mono font-bold rounded">
                  {caps.length} Permissions
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted-text)] font-mono">
                Portal home: {ROLE_HOME[role]}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {caps.map((p) => (
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
