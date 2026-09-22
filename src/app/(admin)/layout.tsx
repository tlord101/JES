import { requireRole } from '@/lib/auth/session';

/** Session-dependent — never statically prerendered. */
export const dynamic = 'force-dynamic';
import { ADMIN_PORTAL_ROLES, roleLabel } from '@/lib/auth/roles';
import { ADMIN_NAV } from '@/lib/navigation';
import PortalShell from '@/components/portal/PortalShell';

/**
 * Administration portal shell.
 *
 * The role check runs on the server for every request, so even if the proxy is
 * bypassed the dashboard data is never rendered for the wrong role.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ADMIN_PORTAL_ROLES);

  return (
    <PortalShell
      portalName="Administration Portal"
      homeHref="/admin"
      nav={ADMIN_NAV}
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


