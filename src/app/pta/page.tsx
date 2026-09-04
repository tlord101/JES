import Link from 'next/link';

export default function PTAPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Header */}
        <div className="bg-[var(--primary)] text-white p-8 md:p-12 rounded-md border-b-4 border-[var(--primary-dark)]">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Parent-Teacher Association</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">JES PTA Forum</h1>
          <p className="mt-4 text-slate-200 text-sm md:text-base max-w-3xl leading-relaxed">
            Fostering strong collaboration between parents and educators to support the academic growth, safety, and well-being of all students at Jasmine Exclusive School.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/pta/register"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors inline-flex items-center gap-2"
            >
              Register for PTA Forum <i className="bi bi-person-plus"></i>
            </Link>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/pta/news" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-newspaper text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">PTA News & Updates</h3>
            <p className="text-xs text-[var(--muted-text)]">Recent resolutions, donation announcements, and community initiatives.</p>
          </Link>

          <Link href="/pta/events" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-calendar-event text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">PTA Meetings & Events</h3>
            <p className="text-xs text-[var(--muted-text)]">General assemblies, family fun days, and executive committee elections.</p>
          </Link>

          <Link href="/pta/register" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-card-checklist text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">PTA Member Registration</h3>
            <p className="text-xs text-[var(--muted-text)]">Register or update your contact information for official PTA communications.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
