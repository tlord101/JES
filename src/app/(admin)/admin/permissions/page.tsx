import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/lib/admin/ui';
import {
  ADMIN_PORTAL_ROLES,
  STAFF_PORTAL_ROLES,
  PARENT_PORTAL_ROLES,
  STUDENT_PORTAL_ROLES,
  ROLE_LABELS,
} from '@/lib/auth/roles';
import type { UserRole } from '@/types/database';

export const metadata = { title: 'Roles & Permissions' };

const PORTALS: { name: string; roles: UserRole[]; note: string }[] = [
  {
    name: 'Administration Portal',
    roles: ADMIN_PORTAL_ROLES,
    note: 'Manage users, finance, settings',
  },
  { name: 'Staff Portal', roles: STAFF_PORTAL_ROLES, note: 'Attendance, results entry, classes' },
  { name: 'Parent Portal', roles: PARENT_PORTAL_ROLES, note: 'Children, results, fees' },
  { name: 'Student Portal', roles: STUDENT_PORTAL_ROLES, note: 'Timetable, results, assignments' },
];

export default async function PermissionsPage() {
  await requireRole(ADMIN_PORTAL_ROLES);
  const supabase = await createClient();
  const { data: profiles } = await supabase.from('profiles').select('role').limit(1000);

  const counts = new Map<UserRole, number>();
  for (const p of profiles ?? []) {
    counts.set(p.role, (counts.get(p.role) ?? 0) + 1);
  }
  const allRoles = Object.keys(ROLE_LABELS) as UserRole[];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Roles &amp; active accounts
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Accounts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allRoles.map((role) => (
                <tr key={role} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-800">{ROLE_LABELS[role]}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{role}</td>
                  <td className="px-4 py-3">
                    <Badge tone={(counts.get(role) ?? 0) > 0 ? 'success' : 'neutral'}>
                      {counts.get(role) ?? 0}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Account counts are live from the <code>profiles</code> table. Permissions are enforced by
          server actions via <code>requireRole()</code> and Row Level Security, not a static
          permission list.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Portal access
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PORTALS.map((portal) => (
            <div key={portal.name} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="font-medium text-slate-800">{portal.name}</div>
              <div className="mb-2 text-xs text-slate-500">{portal.note}</div>
              <div className="flex flex-wrap gap-1.5">
                {portal.roles.map((r) => (
                  <Badge key={r} tone="info">
                    {ROLE_LABELS[r]}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
