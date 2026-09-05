import React from 'react';
import Link from 'next/link';

export default function StudentExamsResultsHistoryPage() {
  const history = [
    {
      title: 'SS1 Mathematics Termly Computer-Based Test',
      subject: 'Mathematics',
      date: '2025-03-24',
      score: 14,
      total: 16,
      percentage: 87.5,
      passed: true,
    },
    {
      title: 'Further Mathematics Quiz #1',
      subject: 'Further Mathematics',
      date: '2025-02-18',
      score: 18,
      total: 20,
      percentage: 90.0,
      passed: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CBT Examination History</h1>
          <p className="text-sm text-slate-500">View all past online assessments and server-verified scores.</p>
        </div>
        <Link
          href="/student/exams"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
        >
          Available Exams &rarr;
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-2.5 px-3">Exam Paper</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Date Taken</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Percentage</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{item.title}</td>
                  <td className="py-3 px-3 text-slate-600">{item.subject}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs">{item.date}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{item.score} / {item.total}</td>
                  <td className="py-3 px-3 font-bold text-blue-700">{item.percentage}%</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      PASSED
                    </span>
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
