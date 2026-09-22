import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { roleHome } from '@/lib/auth/roles';

/**
 * Single entry point after authentication: sends every signed-in user to the
 * portal that matches their role. Used by the proxy when a logged-in user
 * opens a login screen.
 */
export default async function PortalRedirectPage() {
  const user = await getCurrentUser();
  redirect(user ? roleHome(user.role) : '/login');
}
