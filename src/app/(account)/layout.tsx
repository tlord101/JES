import Link from 'next/link';
import { requireUser } from '@/lib/auth/session';
import { roleLabel, roleHome } from '@/lib/auth/roles';
import { signOutAction } from '@/lib/auth/actions';

/** Always dynamic — the layout depends on the signed-in session. */
export const dynamic = 'force-dynamic';

/**
 * Shared account area (currently the profile page) used by every signed-in
 * role. Deliberately minimal: no public website chrome, no portal sidebar.
 */
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-[var(--soft-bg)] flex flex-col">
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-30 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--primary)] text-white font-bold rounded flex items-center justify-center text-sm">
            JES
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--primary-dark)]">My Account</p>
            <p className="text-[11px] text-[var(--muted-text)]">
              {user.fullName} &middot; {roleLabel(user.role)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={roleHome(user.role)}
            className="px-2.5 py-1.5 text-[11px] font-bold border border-[var(--border)] rounded hover:bg-[var(--soft-bg)]"
          >
            Back to portal
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="px-2.5 py-1.5 text-[11px] font-bold border border-[var(--border)] rounded hover:bg-[var(--soft-bg)] flex items-center gap-1.5"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Sign out</span>
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">{children}</main>
    </div>
  );
}
