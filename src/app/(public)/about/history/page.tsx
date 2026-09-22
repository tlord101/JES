import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">About JES</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Our History & Heritage</h1>
        </div>

        <div className="prose text-sm text-[var(--text)] leading-relaxed space-y-6">
          <p>
            Jasmine Exclusive School was established with a singular vision: to create an educational institution in Benin City where rigorous academic discipline, unyielding moral values, and social grace are cultivated harmoniously.
          </p>

          <div className="bg-[var(--soft-bg)] p-6 border border-[var(--border)] rounded-md space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)]">Milestones of Excellence</h2>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <span className="font-bold text-[var(--primary)] bg-white px-2 py-1 border border-[var(--border)] rounded">2010</span>
                <div>
                  <strong>Foundation:</strong> Jasmine Exclusive School opened its doors in Aduwawa with an initial cohort in Nursery and Primary education.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[var(--primary)] bg-white px-2 py-1 border border-[var(--border)] rounded">2014</span>
                <div>
                  <strong>Secondary Expansion:</strong> Established the Secondary School section, equipping state-of-the-art Science and Computer laboratories.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[var(--primary)] bg-white px-2 py-1 border border-[var(--border)] rounded">2018</span>
                <div>
                  <strong>Campus Extension:</strong> Expanded with Campus 2 at Asemota Street to accommodate growing enrollment and modern sports facilities.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-[var(--primary)] bg-white px-2 py-1 border border-[var(--border)] rounded">2022 - Present</span>
                <div>
                  <strong>National Recognition:</strong> Full accreditation by WAEC, NECO, and BECE examination bodies with consistent 100% distinction pass rates.
                </div>
              </li>
            </ul>
          </div>

          <p>
            Today, Jasmine Exclusive School continues to expand its facilities, integrate cutting-edge ICT learning modules, and remain true to its founding motto: <strong>Diligence for Excellence</strong>.
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
