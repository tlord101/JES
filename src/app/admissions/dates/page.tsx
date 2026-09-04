import Link from 'next/link';

export default function DatesPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Admissions</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Key Admissions Dates & Schedule</h1>
        </div>

        <div className="space-y-4">
          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--primary)] bg-white px-2 py-0.5 border border-slate-200 rounded">Batch 1</span>
              <h3 className="font-bold text-sm text-[var(--primary-dark)] mt-1">First Round Entrance Assessment</h3>
              <p className="text-xs text-[var(--muted-text)]">Written testing for Nursery, Primary & Secondary applicants.</p>
            </div>
            <div className="text-xs font-bold text-white bg-[var(--primary)] px-3 py-1.5 rounded self-start md:self-auto">
              Saturday, July 12, 2025
            </div>
          </div>

          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--primary)] bg-white px-2 py-0.5 border border-slate-200 rounded">Batch 2</span>
              <h3 className="font-bold text-sm text-[var(--primary-dark)] mt-1">Second Round Entrance Assessment</h3>
              <p className="text-xs text-[var(--muted-text)]">Late assessment for transferring students.</p>
            </div>
            <div className="text-xs font-bold text-white bg-[var(--primary)] px-3 py-1.5 rounded self-start md:self-auto">
              Saturday, August 16, 2025
            </div>
          </div>

          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--primary)] bg-white px-2 py-0.5 border border-slate-200 rounded">Orientation</span>
              <h3 className="font-bold text-sm text-[var(--primary-dark)] mt-1">New Parents & Students Orientation</h3>
              <p className="text-xs text-[var(--muted-text)]">Welcoming new families, uniform pickup, and facility tour.</p>
            </div>
            <div className="text-xs font-bold text-white bg-[var(--primary)] px-3 py-1.5 rounded self-start md:self-auto">
              Saturday, September 6, 2025
            </div>
          </div>

          <div className="p-5 border border-[var(--border)] rounded bg-[var(--soft-bg)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--primary)] bg-white px-2 py-0.5 border border-slate-200 rounded">Resumption</span>
              <h3 className="font-bold text-sm text-[var(--primary-dark)] mt-1">First Term Resumption</h3>
              <p className="text-xs text-[var(--muted-text)]">Official start of classes for 2025/2026 Academic Year.</p>
            </div>
            <div className="text-xs font-bold text-white bg-[var(--primary)] px-3 py-1.5 rounded self-start md:self-auto">
              Monday, September 8, 2025
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Link href="/admissions" className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
            <i className="bi bi-arrow-left"></i> Back to Admissions
          </Link>
        </div>
      </div>
    </div>
  );
}
