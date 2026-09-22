import Link from 'next/link';

export default function ProcessPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Admissions</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Step-by-Step Application Process</h1>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)]">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center shrink-0 text-sm">1</div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--primary-dark)]">Purchase & Submit Application Form</h3>
              <p className="text-xs text-[var(--muted-text)]">
                Fill out the application form online or collect a paper copy from our Admissions Office at Campus 1 or Campus 2 in Benin City.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)]">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center shrink-0 text-sm">2</div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--primary-dark)]">Entrance Diagnostic Examination</h3>
              <p className="text-xs text-[var(--muted-text)]">
                The candidate attends the scheduled entrance examination covering Mathematics and English Language skills.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)]">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center shrink-0 text-sm">3</div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--primary-dark)]">Interactive Parent Interview</h3>
              <p className="text-xs text-[var(--muted-text)]">
                A brief session with the school principal or guidance counselor to discuss the student&apos;s educational history and learning needs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)]">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white font-bold flex items-center justify-center shrink-0 text-sm">4</div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--primary-dark)]">Offer Letter & Acceptance</h3>
              <p className="text-xs text-[var(--muted-text)]">
                Successful candidates receive an official Admission Offer Letter. Enrollment is secured upon payment of the acceptance deposit.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
          <Link href="/admissions" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Admissions
          </Link>
          <Link href="/admissions/apply" className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded">
            Start Online Application
          </Link>
        </div>
      </div>
    </div>
  );
}
