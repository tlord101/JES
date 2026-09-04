import Link from 'next/link';

export default function AdmissionsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Header Banner */}
        <div className="bg-[var(--primary)] text-white p-8 md:p-12 rounded-md border-b-4 border-[var(--primary-dark)]">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Join Jasmine Exclusive School</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Admissions Overview</h1>
          <p className="mt-4 text-slate-200 text-sm md:text-base max-w-3xl leading-relaxed">
            We welcome applications from parents seeking a disciplined, intellectually rich, and morally sound educational environment for their children.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/admissions/apply"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors inline-flex items-center gap-2"
            >
              Start Online Application <i className="bi bi-arrow-right"></i>
            </Link>
            <Link
              href="/admissions/fees"
              className="px-5 py-2.5 bg-white text-[var(--primary)] hover:bg-slate-100 font-bold text-xs rounded transition-colors"
            >
              View Fee Structure
            </Link>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admissions/requirements" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-list-check text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Requirements</h3>
            <p className="text-xs text-[var(--muted-text)]">Age limits, academic prerequisites, and required documents for entry.</p>
          </Link>

          <Link href="/admissions/process" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-diagram-3 text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Application Process</h3>
            <p className="text-xs text-[var(--muted-text)]">Step-by-step guide from form purchase to assessment and enrollment.</p>
          </Link>

          <Link href="/admissions/fees" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-cash-stack text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Tuition & Fees</h3>
            <p className="text-xs text-[var(--muted-text)]">Transparent breakdown of school fees, hostel charges, and payment options.</p>
          </Link>

          <Link href="/admissions/dates" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-calendar-event text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Key Dates</h3>
            <p className="text-xs text-[var(--muted-text)]">Entrance examination schedules, orientation days, and resumption dates.</p>
          </Link>

          <Link href="/admissions/downloads" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-download text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Downloads</h3>
            <p className="text-xs text-[var(--muted-text)]">Downloadable prospectus, PDF application forms, and medical forms.</p>
          </Link>

          <Link href="/admissions/apply" className="p-6 border-2 border-[var(--primary)] rounded bg-[var(--primary-light)] hover:bg-white transition-colors space-y-2">
            <i className="bi bi-pencil-square text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Apply Online</h3>
            <p className="text-xs text-[var(--muted-text)]">Fill out the digital admission form with instant confirmation.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
