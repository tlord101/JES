'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resultsStore, StudentResult } from '@/lib/academicStore';

export default function AdminResultsOverviewPage() {
  const [results] = useState<StudentResult[]>([...resultsStore]);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Results Management & Moderation Engine</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage subject score entries, termly gradebooks, and multi-stage workflow transitions (Draft → Review → Approve → Publish).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/results/enter"
            className="px-3.5 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
          >
            <i className="bi bi-pencil-square mr-1"></i> Enter Scores
          </Link>
          <Link
            href="/admin/results/review"
            className="px-3.5 py-2 border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
          >
            Review Stage
          </Link>
          <Link
            href="/admin/results/approve"
            className="px-3.5 py-2 border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
          >
            Approval Stage
          </Link>
          <Link
            href="/admin/results/publish"
            className="px-3.5 py-2 bg-green-700 text-white font-bold rounded hover:bg-green-800"
          >
            Publish Results
          </Link>
        </div>
      </div>

      {/* Workflow Stage Explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[var(--border)] rounded space-y-1">
          <div className="font-bold text-[var(--primary-dark)] flex items-center justify-between">
            <span>1. Draft Stage</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 font-bold text-[10px] rounded">Draft</span>
          </div>
          <p className="text-[11px] text-[var(--muted-text)]">Subject teacher enters raw CA and Exam scores.</p>
        </div>

        <div className="p-4 bg-white border border-[var(--border)] rounded space-y-1">
          <div className="font-bold text-[var(--primary-dark)] flex items-center justify-between">
            <span>2. HOD Review</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded">Reviewed</span>
          </div>
          <p className="text-[11px] text-[var(--muted-text)]">Head of Department moderates grading consistency.</p>
        </div>

        <div className="p-4 bg-white border border-[var(--border)] rounded space-y-1">
          <div className="font-bold text-[var(--primary-dark)] flex items-center justify-between">
            <span>3. Principal Approval</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">Approved</span>
          </div>
          <p className="text-[11px] text-[var(--muted-text)]">Principal gives final academic sign-off and remarks.</p>
        </div>

        <div className="p-4 bg-white border border-[var(--border)] rounded space-y-1">
          <div className="font-bold text-[var(--primary-dark)] flex items-center justify-between">
            <span>4. Published</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">Published</span>
          </div>
          <p className="text-[11px] text-[var(--muted-text)]">Available for student/parent view on portal report sheet.</p>
        </div>
      </div>

      {/* Results Ledger Table */}
      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 font-bold text-sm text-[var(--primary-dark)] border-b border-[var(--border)]">
          Term Gradebook Master Ledger
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
              <th className="p-3">Admission No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Class</th>
              <th className="p-3">Subject</th>
              <th className="p-3">CA (30)</th>
              <th className="p-3">Exam (70)</th>
              <th className="p-3 font-bold">Total</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Workflow State</th>
              <th className="p-3 text-right">Report Sheet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {results.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--soft-bg)]">
                <td className="p-3 font-mono font-bold text-[var(--primary-dark)]">{r.admissionNo}</td>
                <td className="p-3 font-bold text-[var(--text)]">{r.studentName}</td>
                <td className="p-3 text-[var(--muted-text)]">{r.className}</td>
                <td className="p-3 font-semibold">{r.subjectName}</td>
                <td className="p-3 font-mono">{r.caScore}</td>
                <td className="p-3 font-mono">{r.examScore}</td>
                <td className="p-3 font-mono font-black text-sm text-[var(--primary-dark)]">{r.totalScore}</td>
                <td className="p-3 font-bold text-green-700">{r.grade}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                      r.status === 'Published'
                        ? 'bg-green-100 text-green-800'
                        : r.status === 'Approved'
                        ? 'bg-amber-100 text-amber-800'
                        : r.status === 'Reviewed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/results/${r.studentId}`}
                    className="px-2.5 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold rounded hover:bg-[var(--soft-bg)]"
                  >
                    View Report Sheet
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
