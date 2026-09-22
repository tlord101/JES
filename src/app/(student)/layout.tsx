import { requireRole } from '@/lib/auth/session';

/** Session-dependent — never statically prerendered. */
export const dynamic = 'force-dynamic';
import { roleLabel, STUDENT_PORTAL_ROLES } from '@/lib/auth/roles';
import { STUDENT_NAV } from '@/lib/navigation';
import PortalShell from '@/components/portal/PortalShell';

/** Student portal shell. */
export default async function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(STUDENT_PORTAL_ROLES);

  return (
    <PortalShell
      portalName="Student Portal"
      homeHref="/student"
      nav={STUDENT_NAV}
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

