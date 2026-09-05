'use client';

import { useState } from 'react';
import { defaultParentAttendances, defaultWards } from '@/lib/parentData';

export default function ParentAttendancePage() {
  const [selectedWardId, setSelectedWardId] = useState<string>(defaultWards[0]?.id || '');

  const activeAttendance = defaultParentAttendances.find((a) => a.wardId === selectedWardId) || defaultParentAttendances[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            Attendance Register
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Wards' Attendance Records
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Daily roll call summaries, punctuality metrics, and attendance percentages for your children.
          </p>
        </div>
      </div>

      {/* Ward Selector Tabs */}
      <div className="bg-white p-2 border border-[var(--border)] rounded flex flex-wrap gap-2 text-xs font-bold">
        {defaultWards.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWardId(w.id)}
            className={`px-4 py-2 rounded transition-colors flex items-center gap-1.5 ${
              selectedWardId === w.id
                ? 'bg-[var(--primary)] text-white'
                : 'text-[var(--text)] hover:bg-[var(--soft-bg)]'
            }`}
          >
            <i className="bi bi-person"></i>
            <span>{w.name} ({w.class})</span>
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Attendance Rate</span>
            <i className="bi bi-pie-chart-fill text-lg text-[var(--primary)]"></i>
          </div>
          <div className="text-2xl font-black text-green-700">{activeAttendance.attendancePercentage}%</div>
          <div className="text-[11px] text-[var(--muted-text)]">Term Total: {activeAttendance.totalDays} Days</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Present Days</span>
            <i className="bi bi-check-circle-fill text-lg text-green-600"></i>
          </div>
          <div className="text-2xl font-extrabold text-[var(--primary-dark)]">{activeAttendance.presentDays} Days</div>
          <div className="text-[11px] text-green-700 font-semibold">Punctual & Regular</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Absent Days</span>
            <i className="bi bi-x-circle-fill text-lg text-red-600"></i>
          </div>
          <div className="text-2xl font-extrabold text-[var(--primary-dark)]">{activeAttendance.absentDays} Day</div>
          <div className="text-[11px] text-slate-500">Excused Absence</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Late Arrivals</span>
            <i className="bi bi-exclamation-triangle-fill text-lg text-amber-500"></i>
          </div>
          <div className="text-2xl font-extrabold text-[var(--primary-dark)]">{activeAttendance.lateDays} Day</div>
          <div className="text-[11px] text-amber-700">Noted by Form Teacher</div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
        <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
          <i className="bi bi-calendar-check text-[var(--primary)]"></i>
          <span>Daily Roll Call Register ({activeAttendance.wardName})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--soft-bg)] border-b border-[var(--border)] text-[var(--primary-dark)] font-bold">
                <th className="p-3">Date</th>
                <th className="p-3">Day of Week</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {activeAttendance.logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--soft-bg)] transition-colors">
                  <td className="p-3 font-bold text-[var(--primary-dark)]">{log.date}</td>
                  <td className="p-3 text-[var(--text)]">{log.dayOfWeek}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded inline-block ${
                      log.status === 'Present' ? 'bg-green-100 text-green-800' :
                      log.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-[var(--muted-text)]">{log.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
