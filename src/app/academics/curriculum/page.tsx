import Link from 'next/link';

export default function CurriculumPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Academics</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Curriculum Framework</h1>
        </div>

        <div className="space-y-6 text-sm text-[var(--text)] leading-relaxed">
          <p>
            Jasmine Exclusive School operates a well-researched, robust curriculum that harmoniously blends the Nigerian National Educational Research and Development Council (NERDC) curriculum with international pedagogical standards.
          </p>

          <div className="space-y-4">
            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Early Childhood Education (Creche & Nursery)</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Emphasizes phonics, foundational numeracy, sensory play, emotional development, and social etiquette in a safe, nurturing environment.
              </p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Primary Education (Primary 1 - 6)</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Focuses on core literacy, mathematical reasoning, basic science, computer studies, civic education, and introductory foreign languages.
              </p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Junior Secondary School (JSS 1 - 3)</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Prepares students for the Basic Education Certificate Examination (BECE). Broad curriculum introducing basic technology, business studies, agricultural science, and creative arts.
              </p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Senior Secondary School (SSS 1 - 3)</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Specialized learning pathways across Science, Commercial, and Humanities departments preparing students for WAEC, NECO, and tertiary entrance examinations.
              </p>
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
