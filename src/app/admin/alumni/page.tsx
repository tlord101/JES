'use client';

import { useState } from 'react';

export default function AdminAlumniPage() {
  const [alumni] = useState([
    { id: '1', name: 'Engr. Osasere Ighodaro', graduationYear: '2015', profession: 'Civil Engineer', email: 'osasere@example.com' },
    { id: '2', name: 'Dr. Blessing Osagie', graduationYear: '2017', profession: 'Medical Doctor', email: 'blessing@example.com' },
  ]);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded">
        <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Alumni Directory & Association CMS</h1>
        <p className="text-xs text-[var(--muted-text)]">
          Manage registered alumni records, graduation yearbooks, and alumni network events.
        </p>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Alumni Name</th>
              <th className="p-3">Graduation Year</th>
              <th className="p-3">Profession / Field</th>
              <th className="p-3">Email Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {alumni.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{a.name}</td>
                <td className="p-3 font-mono font-bold text-[var(--text)]">{a.graduationYear}</td>
                <td className="p-3 font-medium text-[var(--text)]">{a.profession}</td>
                <td className="p-3 font-mono text-[var(--muted-text)]">{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
