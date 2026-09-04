'use client';

export default function AdminSubjectsPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Subject Directory</h1>
        <p className="text-xs text-[var(--muted-text)]">Manage WAEC, NECO, and BECE subject allocations.</p>
      </div>
      <div className="bg-white p-5 border border-[var(--border)] rounded font-semibold text-[var(--muted-text)]">
        Subjects: Mathematics, English Language, Physics, Chemistry, Biology, Further Mathematics, Government, Literature in English, Economics, Agricultural Science, Civic Education.
      </div>
    </div>
  );
}
