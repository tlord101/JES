'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  defaultParentProfile,
  defaultWards,
  defaultParentChildResults,
  defaultParentAssignments,
  defaultParentExams,
  defaultParentAttendances,
  WardChild,
} from '@/lib/parentData';

export default function ParentDashboardPage() {
  const [profile] = useState(defaultParentProfile);
  const [selectedWardId, setSelectedWardId] = useState<string>(defaultWards[0]?.id || '');

  const activeWard = defaultWards.find((w) => w.id === selectedWardId) || defaultWards[0];

  // Specific data for active child
  const wardResult = defaultParentChildResults.find((r) => r.wardId === activeWard.id && r.status === 'Published');
  const wardAssignments = defaultParentAssignments.filter((a) => a.wardId === activeWard.id && (a.status === 'Not Started' || a.status === 'In Progress'));
  const wardExams = defaultParentExams.filter((e) => e.wardId === activeWard.id && e.status === 'Upcoming');
  const wardAttendance = defaultParentAttendances.find((a) => a.wardId === activeWard.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
              Parent & Guardian Portal
            </span>
            <span className="text-xs text-[var(--muted-text)]">
              • Welcome, <strong className="text-[var(--primary-dark)]">{profile.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">
            Parent Dashboard Overview
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Monitor academic progress, term report cards, attendance logs, and fee statements for all your wards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/parent/children"
            className="px-4 py-2 border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-people text-sm"></i>
            <span>All Wards ({defaultWards.length})</span>
          </Link>
          <Link
            href="/parent/fees"
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-credit-card text-sm"></i>
            <span>Pay School Fees</span>
          </Link>
        </div>
      </div>

      {/* Multi-Child Switcher Tabs */}
      <div className="bg-white p-4 border border-[var(--border)] rounded space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-dark)] flex items-center gap-1.5">
            <i className="bi bi-person-bounding-box text-[var(--primary)]"></i>
            <span>Select Active Ward / Child</span>
          </span>
          <span className="text-[11px] text-[var(--muted-text)]">Switch between children to view specific records</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {defaultWards.map((ward) => {
            const isSelected = ward.id === activeWard.id;

            return (
              <button
                key={ward.id}
                onClick={() => setSelectedWardId(ward.id)}
                className={`p-3.5 rounded-lg border text-left transition-colors flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary-dark)] shadow-sm'
                    : 'bg-[var(--soft-bg)] border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]'
                }`}
              >
                <img
                  src={ward.avatarUrl}
                  alt={ward.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <div className="font-extrabold text-xs">{ward.name}</div>
                  <div className="text-[10px] text-[var(--muted-text)] font-semibold">{ward.class} • {ward.admissionNo}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Child Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Academic Term Average</span>
            <i className="bi bi-award-fill text-lg text-amber-500"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">{activeWard.termAverage}%</div>
          <div className="text-[11px] text-green-700 font-semibold">Class Rank: {activeWard.classRank}</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Term Attendance</span>
            <i className="bi bi-check-circle-fill text-lg text-green-600"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">{activeWard.attendancePercentage}%</div>
          <div className="text-[11px] text-slate-500">{wardAttendance?.presentDays || 43} days present</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Tasks</span>
            <i className="bi bi-journal-text text-lg text-[var(--primary)]"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">{wardAssignments.length} Homework</div>
          <div className="text-[11px] text-amber-700 font-semibold">Assignments due this week</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold uppercase tracking-wider">Fee Account Status</span>
            <i className="bi bi-credit-card-fill text-lg text-green-600"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">
            {activeWard.outstandingBalance <= 0 ? 'Fully Paid' : `₦${activeWard.outstandingBalance.toLocaleString()}`}
          </div>
          <div className={`text-[11px] font-bold ${activeWard.outstandingBalance <= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {activeWard.outstandingBalance <= 0 ? 'Verified Second Term Paid' : 'Outstanding Balance'}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Academic Broadsheet & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Published Results */}
          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-award text-[var(--primary)]"></i>
                <span>Published Report Card — {activeWard.name}</span>
              </h2>
              <Link href={`/parent/results/${activeWard.id}`} className="text-xs font-bold text-[var(--primary)] hover:underline">
                Full Broadsheet →
              </Link>
            </div>

            {wardResult ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[var(--primary-dark)]">{wardResult.sessionName} — {wardResult.termName} Report</div>
                    <div className="text-[11px] text-[var(--muted-text)]">Class: {wardResult.className} • Rank: {wardResult.positionInClass}nd out of {wardResult.totalStudents}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 font-extrabold text-xs rounded">
                    Avg: {wardResult.averageScore}%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[var(--soft-bg)] border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
                        <th className="p-2">Subject</th>
                        <th className="p-2 text-center">CA (40)</th>
                        <th className="p-2 text-center">Exam (60)</th>
                        <th className="p-2 text-center">Total (100)</th>
                        <th className="p-2 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {wardResult.subjects.map((s) => (
                        <tr key={s.subjectId}>
                          <td className="p-2 font-bold text-[var(--primary-dark)]">{s.subjectName}</td>
                          <td className="p-2 text-center">{s.caScore}</td>
                          <td className="p-2 text-center">{s.examScore}</td>
                          <td className="p-2 text-center font-extrabold text-[var(--text)]">{s.totalScore}</td>
                          <td className="p-2 text-center">
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                              {s.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-text)]">No published result currently available for this ward.</p>
            )}
          </div>

          {/* Pending Homework & Upcoming CBT Exams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 border border-[var(--border)] rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[var(--primary-dark)] flex items-center gap-2">
                  <i className="bi bi-file-earmark-text text-[var(--primary)]"></i>
                  <span>Assignments ({activeWard.name})</span>
                </h3>
                <Link href="/parent/assignments" className="text-xs font-bold text-[var(--primary)] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                {wardAssignments.length === 0 ? (
                  <p className="text-[11px] text-[var(--muted-text)]">No pending assignments for {activeWard.name}.</p>
                ) : (
                  wardAssignments.map((a) => (
                    <div key={a.id} className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1">
                      <div className="flex justify-between font-bold text-[var(--primary-dark)]">
                        <span>{a.subjectName}</span>
                        <span className="text-amber-700 text-[10px] font-semibold">{a.status}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text)]">{a.title}</div>
                      <div className="text-[10px] text-[var(--muted-text)]">Due: {a.dueDate}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-5 border border-[var(--border)] rounded space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[var(--primary-dark)] flex items-center gap-2">
                  <i className="bi bi-card-checklist text-[var(--primary)]"></i>
                  <span>Upcoming CBT Exams</span>
                </h3>
                <Link href="/parent/exams" className="text-xs font-bold text-[var(--primary)] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-2 text-xs">
                {wardExams.length === 0 ? (
                  <p className="text-[11px] text-[var(--muted-text)]">No upcoming exams scheduled for {activeWard.name}.</p>
                ) : (
                  wardExams.map((e) => (
                    <div key={e.id} className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1">
                      <div className="font-bold text-[var(--primary-dark)]">{e.subjectName} — {e.title}</div>
                      <div className="text-[10px] text-[var(--muted-text)]">Exam Date: {e.examDate} ({e.totalMarks} Marks)</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Fee Overview & PTA Meetings */}
        <div className="space-y-6">
          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-4">
            <h3 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <i className="bi bi-cash-stack text-[var(--primary)]"></i>
              <span>Fee Account Summary</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-text)]">{activeWard.name} Total Fees:</span>
                <span className="font-bold text-[var(--primary-dark)]">₦{activeWard.totalFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-text)]">Amount Settled:</span>
                <span className="font-bold text-green-700">₦{activeWard.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                <span className="font-bold text-[var(--primary-dark)]">Balance Due:</span>
                <span className="font-black text-xs text-[var(--primary-dark)]">
                  ₦{activeWard.outstandingBalance.toLocaleString()}
                </span>
              </div>

              <Link
                href={`/parent/fees/${activeWard.id}`}
                className="w-full mt-2 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex justify-center items-center gap-1.5"
              >
                <i className="bi bi-credit-card"></i>
                <span>Manage & Pay Fees</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
              <h3 className="text-sm font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-people-fill text-[var(--primary)]"></i>
                <span>PTA General Assembly</span>
              </h3>
              <Link href="/parent/pta" className="text-xs font-bold text-[var(--primary)] hover:underline">
                PTA Forum →
              </Link>
            </div>

            <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-xs space-y-1">
              <div className="font-bold text-[var(--primary-dark)]">Second Term PTA Meeting</div>
              <div className="text-[11px] text-[var(--muted-text)]">Saturday, Feb 22, 2025 @ 10:00 AM</div>
              <p className="text-[11px] text-[var(--text)] pt-1">Agenda: Solar e-library expansion, academic progress reports, and sports sponsorship.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
