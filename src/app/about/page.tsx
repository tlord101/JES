import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Banner */}
        <div className="bg-[var(--primary)] text-white p-8 md:p-12 rounded-md border-b-4 border-[var(--primary-dark)]">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">About Jasmine Exclusive School</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Diligence for Excellence</h1>
          <p className="mt-4 text-slate-200 text-sm md:text-base max-w-3xl leading-relaxed">
            Founded with a commitment to academic distinction, moral integrity, and social decorum, Jasmine Exclusive School provides a holistic education that empowers students to excel globally.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/about/history" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-hourglass-split text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Our History</h3>
            <p className="text-xs text-[var(--muted-text)]">Discover how Jasmine Exclusive School was founded and grew into an educational benchmark.</p>
          </Link>

          <Link href="/about/mission-vision" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-compass text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Mission & Vision</h3>
            <p className="text-xs text-[var(--muted-text)]">Read our core educational commitment to nurturing academic and moral excellence.</p>
          </Link>

          <Link href="/about/values" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-shield-check text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Core Values</h3>
            <p className="text-xs text-[var(--muted-text)]">Explore the foundational pillars of Diligence, Integrity, Grace, and Excellence.</p>
          </Link>

          <Link href="/about/principal" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-person-badge text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Principal&apos;s Message</h3>
            <p className="text-xs text-[var(--muted-text)]">A welcome message from our Executive Principal, Dr. (Mrs.) E. O. Aigbe.</p>
          </Link>

          <Link href="/about/accreditation" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-patch-check text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Accreditation</h3>
            <p className="text-xs text-[var(--muted-text)]">Verified quality standards from Edo State Ministry of Education & national examination boards.</p>
          </Link>

          <Link href="/staff" className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] hover:border-[var(--primary)] transition-colors space-y-2">
            <i className="bi bi-people text-2xl text-[var(--primary)]"></i>
            <h3 className="font-bold text-lg text-[var(--primary-dark)]">Staff Directory</h3>
            <p className="text-xs text-[var(--muted-text)]">Meet our experienced educators, administrators, and department heads.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
