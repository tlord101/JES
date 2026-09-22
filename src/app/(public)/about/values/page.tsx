import Link from 'next/link';

export default function ValuesPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">About JES</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Our Core Values</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
            <i className="bi bi-shield-check text-3xl text-[var(--primary)]"></i>
            <h2 className="text-lg font-bold text-[var(--primary-dark)]">1. Diligence</h2>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed">
              We teach our students that true distinction requires consistent, conscientious effort. Hard work and persistence form the bedrock of all achievements.
            </p>
          </div>

          <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
            <i className="bi bi-star text-3xl text-[var(--primary)]"></i>
            <h2 className="text-lg font-bold text-[var(--primary-dark)]">2. Academic Excellence</h2>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed">
              We maintain rigorous academic standards that challenge students to maximize their cognitive potential across STEM, humanities, and languages.
            </p>
          </div>

          <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
            <i className="bi bi-heart text-3xl text-[var(--primary)]"></i>
            <h2 className="text-lg font-bold text-[var(--primary-dark)]">3. Social Grace & Courtesy</h2>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed">
              Politeness, respect for elders and peers, table etiquette, and refined communication skills are intentionally taught in our daily interactions.
            </p>
          </div>

          <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
            <i className="bi bi-person-check text-3xl text-[var(--primary)]"></i>
            <h2 className="text-lg font-bold text-[var(--primary-dark)]">4. Moral Integrity</h2>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed">
              Honesty, ethical responsibility, and moral courage are cultivated so our students become trustworthy leaders in society.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/about" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to About Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
