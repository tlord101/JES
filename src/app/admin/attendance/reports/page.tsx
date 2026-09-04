'use client';

import { useState } from 'react';
import Link from 'next/link';
import { classesStore } from '@/lib/academicStore';

export default function AttendanceReportsPage() {
  const [month, setMonth] = useState('February 2025');
  const [term, setTerm] = useState('Second Term');

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex justify-between items-center">
        <div>
          <Link href="/admin/attendance" className="font-bold text-[var(--primary)] hover:underline">
            ← Back to Daily Attendance Register
          </Link>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)] mt-1">Attendance Analytics & Monthly Summaries</h1>
          <p className="text-xs text-[var(--muted-text)]">Filter student attendance trends by class arm, month, and term.</p>
        </div>
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded flex flex-col sm:flex-row items-center gap-4">
        <div>
          <label className="block font-semibold mb-1">Filter Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-[var(--border)] rounded font-bold">
            <option value="January 2025">January 2025</option>
            <option value="February 2025">February 2025</option>
            <option value="March 2025">March 2025</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Filter Term</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className="p-2 border border-[var(--border)] rounded font-bold">
            <option value="First Term">First Term</option>
            <option value="Second Term">Second Term</option>
            <option value="Third Term">Third Term</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Class Arm</th>
              <th className="p-3">Total Enrolled</th>
              <th className="p-3">Present Average</th>
              <th className="p-3">Absent Average</th>
              <th className="p-3">Attendance Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {classesStore.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-bold text-[var(--primary-dark)]">{c.name}</td>
                <td className="p-3 font-mono font-bold text-[var(--text)]">{c.enrolledCount} Students</td>
                <td className="p-3 font-semibold text-green-700">96.5%</td>
                <td className="p-3 font-semibold text-red-600">3.5%</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                    High Compliance (96.5%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
