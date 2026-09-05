import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cbtExamsStore } from '@/lib/cbtStore';

export default function AdminExamResultsPage({ params }: { params: { id: string } }) {
  const exam = cbtExamsStore.find((e) => e.id === params.id);
  if (!exam) {
    notFound();
  }

  const resultsList = [
    { studentName: 'David Okafor', admissionNo: 'JES/2022/084', score: 14, total: 16, percentage: 87.5, status: 'PASSED', timeTaken: '28 mins', tabSwitches: 0 },
    { studentName: 'Amina Bello', admissionNo: 'JES/2022/091', score: 15, total: 16, percentage: 93.8, status: 'PASSED', timeTaken: '32 mins', tabSwitches: 1 },
    { studentName: 'Emeka Nwosu', admissionNo: 'JES/2022/105', score: 9, total: 16, percentage: 56.3, status: 'PASSED', timeTaken: '41 mins', tabSwitches: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <Link href={`/admin/exams/${exam.id}`} className="text-xs text-blue-600 hover:underline">
          &larr; Back to Exam
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">{exam.title} Student Results</h1>
        <p className="text-sm text-slate-500">Graded submissions and session logs for {exam.className}.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Percentage</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Tab Switch Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resultsList.map((res, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{res.studentName}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium">{res.score} / {res.total}</td>
                  <td className="py-3 px-3 font-bold text-blue-700">{res.percentage}%</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-xs">{res.timeTaken}</td>
                  <td className="py-3 px-3 text-xs">
                    {res.tabSwitches > 0 ? (
                      <span className="text-amber-600 font-bold">{res.tabSwitches} Event(s)</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Clean Session</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
