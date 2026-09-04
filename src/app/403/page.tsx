import Link from 'next/link';

export default function Custom403Page() {
  return (
    <div className="py-20 bg-white text-center">
      <div className="max-w-md mx-auto px-4 space-y-4">
        <span className="text-5xl font-extrabold text-[var(--danger)] block">403</span>
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Access Forbidden</h1>
        <p className="text-xs text-[var(--muted-text)] leading-relaxed">
          You do not have administrative permission to access this resource. Please log in with authorized credentials.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/auth/login" className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded">
            Portal Login
          </Link>
          <Link href="/" className="px-4 py-2 bg-[var(--soft-bg)] border border-[var(--border)] text-xs font-bold rounded">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
