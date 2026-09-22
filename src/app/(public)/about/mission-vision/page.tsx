import Link from 'next/link';

export default function MissionVisionPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-10">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">About JES</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Mission & Vision Statements</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-8 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md space-y-4">
            <div className="flex items-center gap-3 text-[var(--primary)]">
              <i className="bi bi-bullseye text-3xl"></i>
              <h2 className="text-xl font-bold">Our Mission</h2>
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed italic border-l-4 border-[var(--primary)] pl-4">
              «To diligently nurture children&apos;s intellectual inclination until they become excellent academically and morally sound, using a well-researched robust curriculum to teach social grace and courtesy.»
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md space-y-4">
            <div className="flex items-center gap-3 text-[var(--primary)]">
              <i className="bi bi-eye text-3xl"></i>
              <h2 className="text-xl font-bold">Our Vision</h2>
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed italic border-l-4 border-[var(--primary)] pl-4">
              «To raise excellent moral agents of change in our society.»
            </p>
          </div>
        </div>

        <div className="bg-white p-6 border border-[var(--border)] rounded-md space-y-3">
          <h3 className="font-bold text-base text-[var(--primary-dark)]">Philosophical Alignment</h3>
          <p className="text-xs text-[var(--muted-text)] leading-relaxed">
            Our mission and vision guide every lesson plan, co-curricular activity, discipline policy, and community initiative at Jasmine Exclusive School. We measure success not only by academic grades, but by the integrity, courtesy, and civic leadership of our graduates.
          </p>
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
