'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  defaultWards,
  defaultParentChildResults,
  defaultParentAttendances,
} from '@/lib/parentData';

export default function ChildDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;

  // SECURITY: Strictly filter and verify that studentId belongs to parent's authorized wards!
  const ward = defaultWards.find((w) => w.id === studentId);

  if (!ward) {
    notFound();
  }

  const wardResult = defaultParentChildResults.find((r) => r.wardId === ward.id && r.status === 'Published');
  const wardAttendance = defaultParentAttendances.find((a) => a.wardId === ward.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/parent/children" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
            <i className="bi bi-arrow-left"></i>
            <span>Back to All Children</span>
          </Link>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[10px] font-bold rounded">
            Authorized Ward Record
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            {ward.name} ({ward.class})
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Admission No: {ward.admissionNo} • DOB: {ward.dob}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/parent/results/${ward.id}`}
            className="px-3.5 py-2 bg-[var(--primary)] text-white font-bold text-xs rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-file-earmark-bar-graph"></i>
            <span>View Published Report</span>
          </Link>
          <Link
            href={`/parent/fees/${ward.id}`}
            className="px-3.5 py-2 border border-[var(--border)] text-[var(--text)] font-bold text-xs rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-cash-stack"></i>
            <span>Fee Ledger</span>
          </Link>
        </div>
      </div>

      {/* Overview Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo & Stats */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-6 flex flex-col items-center text-center">
          <img
            src={ward.avatarUrl}
            alt={ward.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-[var(--primary-light)]"
          />

          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[var(--primary-dark)]">{ward.name}</h2>
            <p className="text-xs font-bold text-[var(--primary)]">{ward.class}</p>
          </div>

          <div className="w-full pt-4 border-t border-[var(--border)] space-y-2 text-xs text-left">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-[var(--muted-text)]">Overall Term Average:</span>
              <span className="font-extrabold text-[var(--primary-dark)]">{ward.termAverage}%</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-[var(--muted-text)]">Class Position Rank:</span>
              <span className="font-bold text-green-700">{ward.classRank}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-[var(--muted-text)]">Attendance Rate:</span>
              <span className="font-bold text-green-700">{ward.attendancePercentage}%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--muted-text)]">Fee Account:</span>
              <span className="font-bold text-green-700">{ward.feeStatus}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Academic Summary & Attendance Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Published Broad Sheet */}
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <i className="bi bi-award text-[var(--primary)]"></i>
              <span>Academic Performance (Published Term 1)</span>
            </h3>

            {wardResult ? (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--soft-bg)] border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
                        <th className="p-2">Subject Name</th>
                        <th className="p-2 text-center">CA (40)</th>
                        <th className="p-2 text-center">Exam (60)</th>
                        <th className="p-2 text-center">Total (100)</th>
                        <th className="p-2 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {wardResult.subjects.map((sub) => (
                        <tr key={sub.subjectId}>
                          <td className="p-2 font-bold text-[var(--primary-dark)]">{sub.subjectName}</td>
                          <td className="p-2 text-center">{sub.caScore}</td>
                          <td className="p-2 text-center">{sub.examScore}</td>
                          <td className="p-2 text-center font-bold text-[var(--text)]">{sub.totalScore}</td>
                          <td className="p-2 text-center">
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                              {sub.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded italic">
                  <strong>Teacher Remark:</strong> "{wardResult.teacherRemark}"
                </div>
              </div>
            ) : (
              <p className="text-[var(--muted-text)]">No published result available.</p>
            )}
          </div>

          {/* Attendance Log Overview */}
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <i className="bi bi-calendar-check text-[var(--primary)]"></i>
              <span>Attendance Register Summary</span>
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[10px] font-bold text-[var(--muted-text)] block">PRESENT</span>
                <span className="text-lg font-black text-green-700">{wardAttendance?.presentDays || 43} Days</span>
              </div>
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[10px] font-bold text-[var(--muted-text)] block">ABSENT</span>
                <span className="text-lg font-black text-red-600">{wardAttendance?.absentDays || 1} Day</span>
              </div>
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                <span className="text-[10px] font-bold text-[var(--muted-text)] block">LATE</span>
                <span className="text-lg font-black text-amber-600">{wardAttendance?.lateDays || 1} Day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
