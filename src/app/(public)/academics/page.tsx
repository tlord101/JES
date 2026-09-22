import Link from 'next/link';

export default function AcademicsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Header Banner */}
        <div className="bg-[var(--primary)] text-white p-8 md:p-12 rounded-md border-b-4 border-[var(--primary-dark)]">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Academic Excellence</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Academics at JES</h1>
          <p className="mt-4 text-slate-200 text-sm md:text-base max-w-3xl leading-relaxed">
            Delivering a balanced educational framework designed to spark curiosity, critical thinking, and mastery across science, technology, humanities, and moral grace.
          </p>
        </div>

        {/* Academics Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/academics/curriculum" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-book text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Curriculum Framework</h3>
            <p className="text-xs text-[var(--muted-text)]">Explore our integrated curriculum combining Nigerian standards with international best practices.</p>
          </Link>

          <Link href="/academics/subjects" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-journal-code text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Subjects Offered</h3>
            <p className="text-xs text-[var(--muted-text)]">Comprehensive course offerings across STEM, Commercial, Arts, and Social Sciences.</p>
          </Link>

          <Link href="/academics/results" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-award text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Academic Performance</h3>
            <p className="text-xs text-[var(--muted-text)]">Review our 100% pass rates in WAEC, NECO, and BECE examination series.</p>
          </Link>

          <Link href="/academics/clubs" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-people text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Clubs & Societies</h3>
            <p className="text-xs text-[var(--muted-text)]">Co-curricular groups including Red Cross, Chess, Literary & Debating, and Culinary Arts.</p>
          </Link>

          <Link href="/academics/sports" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-trophy text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Sports & Athletics</h3>
            <p className="text-xs text-[var(--muted-text)]">Physical health, teamwork, inter-house sports competitions, and track activities.</p>
          </Link>

          <Link href="/calendar" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-calendar3 text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Term Calendar</h3>
            <p className="text-xs text-[var(--muted-text)]">Key academic dates, examination timetables, and school holidays.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
