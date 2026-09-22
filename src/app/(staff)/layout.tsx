import { requireRole } from '@/lib/auth/session';

/** Session-dependent — never statically prerendered. */
export const dynamic = 'force-dynamic';
import { roleLabel, STAFF_PORTAL_ROLES } from '@/lib/auth/roles';
import { STAFF_NAV } from '@/lib/navigation';
import PortalShell from '@/components/portal/PortalShell';

/** Teaching staff portal shell (teachers, HODs and academic leadership). */
export default async function StaffPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(STAFF_PORTAL_ROLES);

  return (
    <PortalShell
      portalName="Staff Portal"
      homeHref="/staff/dashboard"
      nav={STAFF_NAV}
      user={{
        fullName: user.fullName,
        email: user.email,
        roleLabel: roleLabel(user.role),
        avatarUrl: user.avatarUrl,
      }}
    >
      {children}
    </PortalShell>
  );
}

