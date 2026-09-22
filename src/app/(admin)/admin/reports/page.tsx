'use client';

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Institutional Reports & Analytics</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Generate termly academic performance broadsheets, fee collection statements, and student demographic statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="font-bold text-sm text-[var(--primary-dark)]">Academic Performance Report</div>
          <p className="text-[11px] text-[var(--muted-text)]">
            Class score distribution across WAEC subjects, top-performing students, and fail rates.
          </p>
          <button className="px-3 py-1.5 bg-[var(--primary)] text-white font-bold rounded">Export PDF Broadsheet</button>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="font-bold text-sm text-[var(--primary-dark)]">Bursary Revenue Statement</div>
          <p className="text-[11px] text-[var(--muted-text)]">
            Termly fee collections, outstanding parent balances, bank clearing logs, and receipt ledger.
          </p>
          <button className="px-3 py-1.5 bg-[var(--primary)] text-white font-bold rounded">Export Financial CSV</button>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="font-bold text-sm text-[var(--primary-dark)]">Attendance & Enrollment Audit</div>
          <p className="text-[11px] text-[var(--muted-text)]">
            Daily student register records, class attendance averages, and gender distribution charts.
          </p>
          <button className="px-3 py-1.5 bg-[var(--primary)] text-white font-bold rounded">Export Attendance Audit</button>
        </div>
      </div>
    </div>
  );
}
