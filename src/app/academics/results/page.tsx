import Link from 'next/link';

export default function ResultsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Academics</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Academic Performance & Examination Results</h1>
        </div>

        <div className="space-y-6 text-sm text-[var(--text)] leading-relaxed">
          <p>
            Jasmine Exclusive School maintains a stellar record in external national examinations. Our rigorous academic standards, continuous assessment, and qualified teaching staff consistently yield top-tier results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <span className="text-3xl font-extrabold text-[var(--primary)] block">100%</span>
              <span className="text-xs font-bold text-[var(--primary-dark)] block">WAEC SSCE Pass Rate</span>
              <p className="text-[11px] text-[var(--muted-text)]">Students achieving 5+ credits including Mathematics and English.</p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <span className="text-3xl font-extrabold text-[var(--primary)] block">98.5%</span>
              <span className="text-xs font-bold text-[var(--primary-dark)] block">NECO Distinction Rate</span>
              <p className="text-[11px] text-[var(--muted-text)]">High distinctions in Chemistry, Physics, Literature & Further Math.</p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <span className="text-3xl font-extrabold text-[var(--primary)] block">100%</span>
              <span className="text-xs font-bold text-[var(--primary-dark)] block">BECE Junior Secondary</span>
              <p className="text-[11px] text-[var(--muted-text)]">Smooth progression rate into Senior Secondary School.</p>
            </div>
          </div>

          <div className="p-6 border border-[var(--border)] rounded bg-white space-y-3">
            <h2 className="text-base font-bold text-[var(--primary-dark)]">Portal Results Access</h2>
            <p className="text-xs text-[var(--muted-text)]">
              Enrolled parents can view detailed termly report cards, subject breakdowns, class position summaries, and teacher comments securely via the school portal.
            </p>
            <div className="pt-2">
              <Link href="/auth/login" className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded inline-flex items-center gap-1.5">
                <i className="bi bi-person-lock"></i> Login to Parent Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/academics" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Academics
          </Link>
        </div>
      </div>
    </div>
  );
}
