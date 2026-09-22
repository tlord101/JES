import Link from 'next/link';

export default function AccreditationPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">About JES</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Accreditation & Quality Standards</h1>
        </div>

        <div className="space-y-6 text-sm text-[var(--text)] leading-relaxed">
          <p>
            Jasmine Exclusive School operates with full statutory approval and accreditation from statutory Nigerian educational governing bodies and examination councils.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
              <i className="bi bi-patch-check-fill text-3xl text-[var(--success)]"></i>
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Edo State Ministry of Education</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Fully licensed and registered as a premier provider of Creche, Nursery, Primary, and Secondary education in Edo State. Meets all statutory facility, safety, and teacher qualification criteria.
              </p>
            </div>

            <div className="p-6 border border-[var(--border)] rounded bg-[var(--soft-bg)] space-y-3">
              <i className="bi bi-award-fill text-3xl text-[var(--primary)]"></i>
              <h2 className="text-base font-bold text-[var(--primary-dark)]">WAEC & NECO Examination Centers</h2>
              <p className="text-xs text-[var(--muted-text)]">
                Officially accredited exam center for the West African Examinations Council (WAEC) and National Examinations Council (NECO) for SSCE certifications.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded-md space-y-3">
            <h3 className="font-bold text-base text-[var(--primary-dark)]">Quality Assurance Framework</h3>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed">
              To preserve our reputation for excellence, JES undergoes regular internal and external quality assurance audits. These audits evaluate science laboratories, computing facilities, teaching methodologies, library resources, and child protection protocols against global educational benchmarks.
            </p>
          </div>
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
