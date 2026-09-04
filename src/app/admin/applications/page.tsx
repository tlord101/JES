'use client';

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Admissions & Applications Management</h1>
        <p className="text-xs text-[var(--muted-text)]">Review, process, and approve prospective student entrance applications.</p>
      </div>
      <div className="bg-white p-5 border border-[var(--border)] rounded font-semibold text-[var(--muted-text)]">
        14 Active Applications Pending Entrance Exam & Interview Scheduling.
      </div>
    </div>
  );
}
