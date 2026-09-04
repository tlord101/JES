'use client';

export default function AdminClassesPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Classes & Arms Management</h1>
        <p className="text-xs text-[var(--muted-text)]">Manage JSS and SS class arms, form teachers, and classroom capacities.</p>
      </div>
      <div className="bg-white p-5 border border-[var(--border)] rounded font-semibold text-[var(--muted-text)]">
        Classes: Nursery 1-3, Primary 1-6, JSS 1-3 (Red, Blue, Gold), SS 1-3 (Science, Arts, Commercial).
      </div>
    </div>
  );
}
