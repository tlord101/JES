import Link from 'next/link';

export default function AlumniPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Header Banner */}
        <div className="bg-[var(--primary)] text-white p-8 md:p-12 rounded-md border-b-4 border-[var(--primary-dark)]">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">JES Global Network</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Alumni Association</h1>
          <p className="mt-4 text-slate-200 text-sm md:text-base max-w-3xl leading-relaxed">
            Connecting JES graduates across healthcare, engineering, law, business, and tech around the world.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/alumni/register"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors inline-flex items-center gap-2"
            >
              Join Alumni Network <i className="bi bi-person-plus"></i>
            </Link>
            <Link
              href="/alumni/directory"
              className="px-5 py-2.5 bg-white text-[var(--primary)] hover:bg-slate-100 font-bold text-xs rounded transition-colors"
            >
              Explore Directory
            </Link>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/alumni/directory" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-people text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Directory</h3>
            <p className="text-xs text-[var(--muted-text)]">Connect with fellow JES graduates and mentors worldwide.</p>
          </Link>

          <Link href="/alumni/news" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-newspaper text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Alumni News</h3>
            <p className="text-xs text-[var(--muted-text)]">Read achievements, endowment updates, and alumni spotlights.</p>
          </Link>

          <Link href="/alumni/events" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-calendar-event text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Reunions & Events</h3>
            <p className="text-xs text-[var(--muted-text)]">Homecoming galas, mentorship webinars, and networking meetups.</p>
          </Link>

          <Link href="/alumni/register" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-card-checklist text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Register</h3>
            <p className="text-xs text-[var(--muted-text)]">Update your profile to stay connected with Jasmine Exclusive School.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
