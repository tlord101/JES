import Link from 'next/link';

export default function SportsPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Academics & Co-Curricular</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Sports & Physical Education</h1>
        </div>

        <div className="space-y-6 text-sm text-[var(--text)] leading-relaxed">
          <p>
            Physical fitness, sportsmanship, and teamwork are fundamental components of a complete education at Jasmine Exclusive School. Through our sports programs, students develop resilience, healthy competitive spirit, and physical wellness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
              <i className="bi bi-trophy text-3xl text-amber-600"></i>
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Annual Inter-House Sports</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Our flagship athletic event featuring track and field sprints, relays, high jump, long jump, chess, and football across Red, Blue, Green, and Yellow houses.
              </p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
              <i className="bi bi-dribbble text-3xl text-[var(--primary)]"></i>
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Athletic Facilities</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Standard sports field, basketball court, volleyball pitch, indoor table tennis, and chess pavilion located across Campus 1 and Campus 2.
              </p>
            </div>
          </div>

          <div className="p-6 border border-[var(--border)] rounded bg-white space-y-3">
            <h3 className="font-bold text-base text-[var(--primary-dark)]">Sporting Disciplines Offered</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Track & Field</div>
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Football (Soccer)</div>
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Basketball</div>
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Table Tennis</div>
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Volleyball</div>
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Badminton</div>
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Chess & Scrabble</div>
              <div className="p-3 bg-[var(--soft-bg)] border border-slate-200 rounded font-semibold">Calisthenics</div>
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
