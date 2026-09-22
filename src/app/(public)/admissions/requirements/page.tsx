import Link from 'next/link';

export default function RequirementsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Admissions</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Entry Requirements</h1>
        </div>

        <div className="space-y-6 text-sm text-[var(--text)] leading-relaxed">
          <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md space-y-3">
            <h2 className="text-base font-bold text-[var(--primary-dark)]">1. Age Criteria</h2>
            <ul className="space-y-2 text-xs text-[var(--muted-text)] list-disc pl-5">
              <li><strong>Creche:</strong> 3 months to 1.5 years old.</li>
              <li><strong>Nursery 1:</strong> Minimum 3 years old by September 31st.</li>
              <li><strong>Primary 1:</strong> Minimum 5 to 6 years old.</li>
              <li><strong>Junior Secondary (JSS 1):</strong> Minimum 10 to 11 years old.</li>
            </ul>
          </div>

          <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md space-y-3">
            <h2 className="text-base font-bold text-[var(--primary-dark)]">2. Academic Assessment</h2>
            <p className="text-xs text-[var(--muted-text)]">
              All candidates entering Primary 1 through Senior Secondary 2 are required to take a written diagnostic assessment covering Mathematics, English Language, and General Knowledge.
            </p>
          </div>

          <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md space-y-3">
            <h2 className="text-base font-bold text-[var(--primary-dark)]">3. Mandatory Documents</h2>
            <ul className="space-y-2 text-xs text-[var(--muted-text)] list-disc pl-5">
              <li>Completed Admission Application Form.</li>
              <li>Copy of Birth Certificate or Statutory Declaration of Age.</li>
              <li>Two recent passport-sized photographs (white background).</li>
              <li>Attestation letter & recent academic report cards from previous school.</li>
              <li>Medical fitness certificate from a recognized clinic.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
          <Link href="/admissions" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Admissions Overview
          </Link>
          <Link href="/admissions/apply" className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded">
            Proceed to Apply
          </Link>
        </div>
      </div>
    </div>
  );
}
