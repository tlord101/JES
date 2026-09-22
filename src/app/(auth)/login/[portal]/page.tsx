import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { isPortalId, PORTALS, ROLE_LABELS, PORTAL_IDS } from '@/lib/auth/roles';

type PortalLoginProps = {
  params: Promise<{ portal: string }>;
  searchParams: Promise<{ redirect?: string }>;
};

export function generateStaticParams() {
  return PORTAL_IDS.map((portal) => ({ portal }));
}

export async function generateMetadata({ params }: PortalLoginProps): Promise<Metadata> {
  const { portal } = await params;
  const definition = isPortalId(portal) ? PORTALS[portal] : null;

  return {
    title: definition ? `${definition.title} Sign In` : 'Portal Sign In',
    robots: { index: false, follow: false },
  };
}

/**
 * Dedicated login screen per portal: the visitor sees exactly which roles are
 * allowed here, and the server action enforces the same list.
 */
export default async function PortalLoginPage({ params, searchParams }: PortalLoginProps) {
  const { portal } = await params;
  const { redirect: redirectTo } = await searchParams;

  if (!isPortalId(portal)) {
    notFound();
  }

  const definition = PORTALS[portal];
  const safeRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : undefined;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="inline-flex w-12 h-12 items-center justify-center rounded bg-[var(--primary)] text-white text-xl">
          <i className={`bi ${definition.icon}`}></i>
        </span>
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">{definition.title}</h1>
        <p className="text-xs text-[var(--muted-text)]">{definition.description}</p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-md p-6 space-y-5">
        <LoginForm portal={portal} redirectTo={safeRedirect} />

        <div className="pt-4 border-t border-[var(--border)] space-y-2">
          <p className="text-[11px] font-bold text-[var(--text)]">Roles served by this portal</p>
          <div className="flex flex-wrap gap-1.5">
            {definition.roles.map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 text-[10px] font-semibold bg-[var(--soft-bg)] border border-[var(--border)] rounded text-[var(--muted-text)]"
              >
                {ROLE_LABELS[role]}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-[var(--muted-text)]">
            Signed in with the wrong portal?{' '}
            <Link href="/login" className="font-bold text-[var(--primary)] hover:underline">
              Choose another portal
            </Link>
            . You will always be redirected to the portal that matches your role.
          </p>
        </div>
      </div>

      <p className="text-center text-[11px] text-[var(--muted-text)]">
        Trouble signing in? Read the{' '}
        <Link href="/faq" className="font-bold text-[var(--primary)] hover:underline">
          portal FAQs
        </Link>{' '}
        or contact the school office on +234 806 078 2404.
      </p>
    </div>
  );
}
