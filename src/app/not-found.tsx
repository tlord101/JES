import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-20 bg-white text-center">
      <div className="max-w-md mx-auto px-4 space-y-4">
        <span className="text-5xl font-extrabold text-[var(--primary)] block">404</span>
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Page Not Found</h1>
        <p className="text-xs text-[var(--muted-text)] leading-relaxed">
          The requested page could not be found or may have been moved. Please check the URL or return to our homepage.
        </p>
        <div className="pt-2">
          <Link href="/" className="px-5 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded inline-flex items-center gap-2">
            <i className="bi bi-house-door"></i> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
