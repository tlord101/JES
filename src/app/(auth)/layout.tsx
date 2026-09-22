import Link from 'next/link';

/**
 * Chrome-free shell for authentication screens. The portals deliberately do
 * not show the public website header/footer so a visitor is never distracted
 * (or confused) while signing in.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--soft-bg)] flex flex-col">
      <header className="bg-white border-b border-[var(--border)] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-10 h-10 bg-[var(--primary)] text-white font-bold rounded flex items-center justify-center text-sm">
              JES
            </span>
            <span className="text-left">
              <span className="block font-bold text-sm text-[var(--primary-dark)] leading-tight">
                Jasmine Exclusive School
              </span>
              <span className="block text-[11px] text-[var(--muted-text)]">
                Diligence for Excellence
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-[11px] font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
          >
            <i className="bi bi-arrow-left"></i>
            Back to website
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 px-4">{children}</main>

      <footer className="border-t border-[var(--border)] bg-white px-4 py-4">
        <p className="max-w-6xl mx-auto text-[11px] text-[var(--muted-text)] text-center">
          &copy; {new Date().getFullYear()} Jasmine Exclusive School, Aduwawa, Benin City, Edo State.
          Accounts are issued by the school administration.
        </p>
      </footer>
    </div>
  );
}
