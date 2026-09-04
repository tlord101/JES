import Link from 'next/link';

export default function Custom500Page() {
  return (
    <div className="py-20 bg-white text-center">
      <div className="max-w-md mx-auto px-4 space-y-4">
        <span className="text-5xl font-extrabold text-[var(--warning)] block">500</span>
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Server Error</h1>
        <p className="text-xs text-[var(--muted-text)] leading-relaxed">
          An internal server error occurred while processing your request. Please try again later or contact ICT support.
        </p>
        <div className="pt-2">
          <Link href="/" className="px-5 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded inline-flex items-center gap-2">
            <i className="bi bi-arrow-left"></i> Return to Safety
          </Link>
        </div>
      </div>
    </div>
  );
}
