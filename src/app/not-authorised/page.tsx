import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { roleHome } from '@/lib/auth/roles';

export const metadata: Metadata = {
  title: 'Not Authorised',
  robots: { index: false, follow: false },
};

/**
 * Shown when a signed-in user opens a portal that does not match their role.
 * Signed-out visitors never land here: they are sent to a login screen.
 */
export default async function NotAuthorisedPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[var(--soft-bg)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-[var(--border)] rounded-md p-8 space-y-4 text-center">
        <span className="inline-flex w-14 h-14 items-center justify-center rounded bg-red-50 text-red-600 text-2xl">
          <i className="bi bi-shield-exclamation"></i>
        </span>
        <h1 className="text-xl font-bold text-[var(--primary-dark)]">Access not permitted</h1>
        <p className="text-xs text-[var(--muted-text)]">
          {user
            ? `Your account does not have permission to open this section. You are signed in as ${user.email}.`
            : 'You need to sign in with an account that has permission to view this section.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          {user ? (
            <Link
              href={roleHome(user.role)}
              className="px-4 py-2 text-xs font-bold bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)]"
            >
              Go to my portal
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)]"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/contact"
            className="px-4 py-2 text-xs font-bold border border-[var(--border)] rounded hover:bg-[var(--soft-bg)]"
          >
            Contact the school office
          </Link>
        </div>
      </div>
    </div>
  );
}
