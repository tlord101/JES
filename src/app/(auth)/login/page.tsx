import type { Metadata } from 'next';
import Link from 'next/link';
import { PORTALS, PORTAL_IDS } from '@/lib/auth/roles';

export const metadata: Metadata = {
  title: 'Portal Sign In',
  description:
    'Sign in to the Jasmine Exclusive School administration, staff, parent or student portal.',
  robots: { index: false, follow: false },
};

/**
 * Portal selector. Reached from the public website "Portal Login" link.
 * Each card opens a dedicated login screen with role specific help text.
 */
export default function LoginPortalSelectorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-dark)]">
          Jasmine Exclusive School Portal
        </h1>
        <p className="text-sm text-[var(--muted-text)] max-w-2xl mx-auto">
          Choose the portal that matches your role. Credentials are issued by the school
          administration and are different for every portal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PORTAL_IDS.map((portalId) => {
          const portal = PORTALS[portalId];
          return (
            <Link
              key={portalId}
              href={`/login/${portalId}`}
              className="group bg-white border border-[var(--border)] rounded-md p-5 hover:border-[var(--primary)] transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="w-11 h-11 rounded bg-[var(--primary-light)] text-[var(--primary-dark)] flex items-center justify-center text-xl">
                  <i className={`bi ${portal.icon}`}></i>
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-sm text-[var(--primary-dark)] group-hover:text-[var(--primary)]">
                    {portal.title}
                  </span>
                  <span className="block text-xs text-[var(--muted-text)] mt-1">
                    {portal.description}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--primary)]">
                    Continue
                    <i className="bi bi-arrow-right"></i>
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-[var(--border)] rounded-md p-5 space-y-2">
        <h2 className="font-bold text-sm text-[var(--primary-dark)]">Need an account?</h2>
        <p className="text-xs text-[var(--muted-text)]">
          Parents, students and alumni can request an account online. Staff and administrative
          accounts are created by the school and cannot be self-registered.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/register"
            className="px-3 py-2 text-xs font-bold bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)]"
          >
            Create a parent / student account
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 text-xs font-bold border border-[var(--border)] rounded hover:bg-[var(--soft-bg)]"
          >
            Contact the school office
          </Link>
        </div>
      </div>
    </div>
  );
}
