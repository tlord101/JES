'use client';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Bursary Receipts & Payment Clearing</h1>
        <p className="text-xs text-[var(--muted-text)] font-semibold">Track online payments, bank transfer receipts, and issue official bursary clearing slips.</p>
      </div>
      <div className="bg-white p-5 border border-[var(--border)] rounded font-semibold text-[var(--muted-text)]">
        Recent Cleared Payments: REC-2025-001 (₦185,000), REC-2025-002 (₦165,000). Total Cleared: ₦18,450,000.
      </div>
    </div>
  );
}
