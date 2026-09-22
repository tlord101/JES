import { requireRole } from '@/lib/auth/session';

/** Session-dependent — never statically prerendered. */
export const dynamic = 'force-dynamic';
import { PARENT_PORTAL_ROLES, roleLabel } from '@/lib/auth/roles';
import { PARENT_NAV } from '@/lib/navigation';
import PortalShell from '@/components/portal/PortalShell';

/** Parent / guardian portal shell. */
export default async function ParentPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(PARENT_PORTAL_ROLES);

  return (
    <PortalShell
      portalName="Parent Portal"
      homeHref="/parent"
      nav={PARENT_NAV}
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

