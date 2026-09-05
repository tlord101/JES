'use client';

import { use } from 'react';
import Link from 'next/link';
import { resultsStore, StudentResult } from '@/lib/academicStore';
import { studentsStore } from '@/lib/cmsStore';

export default function PrintableReportSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const student = studentsStore.find((s) => s.id === studentId) || studentsStore[0];
  const studentResults = resultsStore.filter((r) => r.studentId === student.id);

  const totalScoreSum = studentResults.reduce((acc, curr) => acc + curr.totalScore, 0);
  const averageScore = studentResults.length > 0 ? (totalScoreSum / studentResults.length).toFixed(1) : '0';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="print:hidden bg-white p-4 border border-[var(--border)] rounded flex justify-between items-center">
        <Link href="/admin/results" className="font-bold text-[var(--primary)] hover:underline">
          ← Back to Results Ledger
        </Link>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] flex items-center gap-1.5"
        >
          <i className="bi bi-printer-fill"></i>
          <span>Print Official Report Sheet</span>
        </button>
      </div>

      {/* Official Report Sheet Container */}
      <div className="bg-white p-8 border border-slate-300 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none text-slate-800 font-serif">
        {/* School Header Banner */}
        <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
          <div className="w-12 h-12 bg-[var(--primary-dark)] text-white font-black text-xl flex items-center justify-center mx-auto rounded">
            JES
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-[var(--primary-dark)]">
            Jasmine Exclusive School
          </h1>
          <p className="text-xs font-bold italic tracking-wide text-slate-600">Motto: Diligence for Excellence</p>
          <p className="text-[11px] text-slate-500 font-sans">
            12 Aitamegbe Street, Off Narrow Way Street, Aduwawa, Benin City, Edo State • Tel: +234 806 078 2404
          </p>
          <div className="pt-2">
            <span className="px-4 py-1 bg-slate-100 text-slate-900 border border-slate-400 text-xs font-sans font-bold uppercase tracking-widest inline-block">
              Termly Student Terminal Academic Report Sheet
            </span>
          </div>
        </div>

        {/* Student Identification Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans bg-slate-50 p-4 border border-slate-200 rounded">
          <div>
            <span className="text-slate-500 block font-semibold">STUDENT NAME:</span>
            <strong className="text-slate-900 font-bold">{student.name}</strong>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">ADMISSION NO:</span>
            <strong className="text-slate-900 font-mono font-bold">{student.admissionNo}</strong>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">CLASS ARM:</span>
            <strong className="text-slate-900 font-bold">{student.class}</strong>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">ACADEMIC SESSION:</span>
            <strong className="text-slate-900 font-bold">2024/2025 (First Term)</strong>
          </div>
        </div>

        {/* Subject Results Breakdown Table */}
        <div className="font-sans">
          <table className="w-full text-left border-collapse text-xs border border-slate-800">
            <thead>
              <tr className="bg-slate-800 text-white font-bold border-b border-slate-800">
                <th className="p-2.5 border-r border-slate-700">SUBJECT TITLE</th>
                <th className="p-2.5 text-center border-r border-slate-700">CA SCORE (30)</th>
                <th className="p-2.5 text-center border-r border-slate-700">EXAM SCORE (70)</th>
                <th className="p-2.5 text-center border-r border-slate-700 font-black">TOTAL (100)</th>
                <th className="p-2.5 text-center border-r border-slate-700">GRADE</th>
                <th className="p-2.5 text-center border-r border-slate-700">REMARK</th>
                <th className="p-2.5 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {studentResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500 italic">
                    No term scores entered or published for this student yet.
                  </td>
                </tr>
              ) : (
                studentResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">{r.subjectName}</td>
                    <td className="p-2.5 text-center font-mono border-r border-slate-200">{r.caScore}</td>
                    <td className="p-2.5 text-center font-mono border-r border-slate-200">{r.examScore}</td>
                    <td className="p-2.5 text-center font-mono font-black text-slate-900 border-r border-slate-200">{r.totalScore}</td>
                    <td className="p-2.5 text-center font-bold text-slate-900 border-r border-slate-200">{r.grade}</td>
                    <td className="p-2.5 text-center font-semibold text-slate-700 border-r border-slate-200">{r.remark}</td>
                    <td className="p-2.5 text-center font-semibold text-[10px] text-green-700">{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Academic Performance Summary */}
        <div className="grid grid-cols-3 gap-3 font-sans text-center text-xs">
          <div className="p-3 bg-slate-100 border border-slate-300 rounded">
            <div className="text-[10px] text-slate-500 font-bold uppercase">GRAND TOTAL MARKS</div>
            <div className="font-mono font-black text-base text-slate-900 pt-0.5">{totalScoreSum} / {studentResults.length * 100}</div>
          </div>
          <div className="p-3 bg-slate-100 border border-slate-300 rounded">
            <div className="text-[10px] text-slate-500 font-bold uppercase">TERM AVERAGE</div>
            <div className="font-mono font-black text-base text-slate-900 pt-0.5">{averageScore}%</div>
          </div>
          <div className="p-3 bg-slate-100 border border-slate-300 rounded">
            <div className="text-[10px] text-slate-500 font-bold uppercase">CLASS POSITION</div>
            <div className="font-mono font-black text-base text-slate-900 pt-0.5">2nd out of 28</div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3 border border-slate-300 rounded space-y-1">
            <span className="font-bold text-slate-900 block">SUBJECT / FORM TEACHER'S REMARK:</span>
            <p className="text-slate-700 italic">
              «Consistently demonstrates strong analytical and mathematical problem-solving skills. Excellent conduct in class.»
            </p>
          </div>

          <div className="p-3 border border-slate-300 rounded space-y-1">
            <span className="font-bold text-slate-900 block">PRINCIPAL'S OFFICIAL REMARK:</span>
            <p className="text-slate-700 italic">
              «An outstanding academic performance. Keep up the diligence for excellence!»
            </p>
          </div>
        </div>

        {/* Official Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-6 font-sans text-xs border-t border-slate-300">
          <div className="text-center space-y-8">
            <div className="border-b border-slate-400 w-48 mx-auto"></div>
            <span className="font-bold text-slate-700 block">Form Teacher's Signature & Date</span>
          </div>

          <div className="text-center space-y-8">
            <div className="border-b border-slate-400 w-48 mx-auto"></div>
            <span className="font-bold text-slate-700 block">Principal's Official Stamp & Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
}
