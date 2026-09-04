'use client';

export default function AdminFeesPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Tuition & Fee Structure Management</h1>
        <p className="text-xs text-[var(--muted-text)]">Manage termly fee schedules for nursery, primary, JSS, and SS levels.</p>
      </div>
      <div className="bg-white p-5 border border-[var(--border)] rounded font-semibold text-[var(--muted-text)]">
        Fee Schedules: Nursery (₦120,000/term), Primary (₦145,000/term), JSS (₦165,000/term), SS (₦185,000/term).
      </div>
    </div>
  );
}
