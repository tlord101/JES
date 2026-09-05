'use client';

import Link from 'next/link';
import { defaultWards } from '@/lib/parentData';

export default function ParentChildrenListPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Enrolled Wards
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            My Enrolled Children ({defaultWards.length})
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Overview of linked student records, active academic standing, and attendance percentages.
          </p>
        </div>
      </div>

      {/* Grid of Children */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultWards.map((ward) => (
          <div
            key={ward.id}
            className="bg-white border border-[var(--border)] rounded p-6 space-y-4 hover:shadow-sm transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-[var(--border)] pb-4">
                <img
                  src={ward.avatarUrl}
                  alt={ward.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[var(--primary-light)]"
                />
                <div>
                  <h2 className="text-base font-extrabold text-[var(--primary-dark)]">{ward.name}</h2>
                  <p className="text-xs font-bold text-[var(--primary)]">{ward.class}</p>
                  <p className="text-[11px] text-[var(--muted-text)]">Admission No: {ward.admissionNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <span className="text-[10px] text-[var(--muted-text)] font-bold block">TERM AVG</span>
                  <span className="font-black text-sm text-[var(--primary-dark)] mt-0.5 block">{ward.termAverage}%</span>
                </div>

                <div className="p-2.5 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <span className="text-[10px] text-[var(--muted-text)] font-bold block">ATTENDANCE</span>
                  <span className="font-black text-sm text-green-700 mt-0.5 block">{ward.attendancePercentage}%</span>
                </div>

                <div className="p-2.5 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <span className="text-[10px] text-[var(--muted-text)] font-bold block">RANK</span>
                  <span className="font-bold text-xs text-[var(--primary-dark)] mt-1 block">{ward.classRank}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-end">
              <Link
                href={`/parent/children/${ward.id}`}
                className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
              >
                <span>View Full Profile & Records</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
