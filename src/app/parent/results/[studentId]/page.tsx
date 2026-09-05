'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { defaultParentChildResults, defaultWards } from '@/lib/parentData';

export default function SpecificChildResultPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;

  // SECURITY CHECK: Verify studentId belongs to parent's authorized wards!
  const ward = defaultWards.find((w) => w.id === studentId);

  if (!ward) {
    notFound();
  }

  // Filter strictly for published results of this child!
  const childResults = defaultParentChildResults.filter((r) => r.wardId === ward.id && r.status === 'Published');
  const result = childResults[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0 print:space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <Link href="/parent/results" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
            <i className="bi bi-arrow-left"></i>
            <span>Back to Results List</span>
          </Link>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[10px] font-bold rounded">
            Report Card — {ward.name}
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Terminal Academic Broadsheet
          </h1>
        </div>

        {result && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-printer text-sm"></i>
            <span>Print Report Card</span>
          </button>
        )}
      </div>

      {!result ? (
        <div className="bg-white p-8 border border-[var(--border)] rounded text-center text-xs text-[var(--muted-text)]">
          No published result currently available for {ward.name}.
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 border border-[var(--border)] rounded space-y-6 shadow-sm print:border-none print:shadow-none">
          {/* Header Header */}
          <div className="border-b-2 border-[var(--primary)] pb-6 text-center space-y-2">
            <div className="text-2xl font-black text-[var(--primary-dark)] uppercase tracking-wider">
              Jasmine Exclusive School
            </div>
            <div className="text-xs font-bold text-[var(--muted-text)]">
              Aduwawa Campus, Benin City, Edo State • Motto: Diligence for Excellence
            </div>
            <div className="inline-block px-4 py-1 bg-[var(--primary-light)] text-[var(--primary-dark)] font-extrabold text-xs rounded uppercase mt-2">
              Official Terminal Report Card ({result.sessionName} - {result.termName})
            </div>
          </div>

          {/* Student Meta Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-xs">
            <div>
              <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Student Name</span>
              <span className="font-bold text-[var(--primary-dark)] text-sm">{ward.name}</span>
            </div>
            <div>
              <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Admission Number</span>
              <span className="font-bold text-[var(--primary-dark)]">{ward.admissionNo}</span>
            </div>
            <div>
              <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Class</span>
              <span className="font-bold text-[var(--primary-dark)]">{result.className}</span>
            </div>
            <div>
              <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Class Rank</span>
              <span className="font-extrabold text-green-700">
                {result.positionInClass}nd out of {result.totalStudents}
              </span>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--primary-dark)] text-white font-bold">
                  <th className="p-3 border border-[var(--primary-dark)]">Subject Name</th>
                  <th className="p-3 border border-[var(--primary-dark)] text-center">CA Score (40)</th>
                  <th className="p-3 border border-[var(--primary-dark)] text-center">Exam Score (60)</th>
                  <th className="p-3 border border-[var(--primary-dark)] text-center">Total Score (100)</th>
                  <th className="p-3 border border-[var(--primary-dark)] text-center">Grade</th>
                  <th className="p-3 border border-[var(--primary-dark)]">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {result.subjects.map((sub) => (
                  <tr key={sub.subjectId} className="hover:bg-[var(--soft-bg)] transition-colors">
                    <td className="p-3 border border-[var(--border)] font-bold text-[var(--primary-dark)]">
                      {sub.subjectName}
                    </td>
                    <td className="p-3 border border-[var(--border)] text-center font-mono">{sub.caScore}</td>
                    <td className="p-3 border border-[var(--border)] text-center font-mono">{sub.examScore}</td>
                    <td className="p-3 border border-[var(--border)] text-center font-extrabold text-[var(--primary-dark)] font-mono">
                      {sub.totalScore}
                    </td>
                    <td className="p-3 border border-[var(--border)] text-center">
                      <span className="px-2.5 py-0.5 bg-green-100 text-green-800 font-extrabold text-[11px] rounded inline-block">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="p-3 border border-[var(--border)] text-[var(--muted-text)]">{sub.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-[var(--border)]">
            <div className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-2">
              <span className="font-bold text-[var(--primary-dark)] block">Class Teacher Remarks:</span>
              <p className="italic text-[var(--text)]">"{result.teacherRemark}"</p>
            </div>

            <div className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-2">
              <span className="font-bold text-[var(--primary-dark)] block">Principal Remarks:</span>
              <p className="italic text-[var(--text)]">"{result.principalRemark}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
