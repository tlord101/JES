import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockStaffExams } from '@/lib/staffData';

export default function StaffExamResultsPage({ params }: { params: { id: string } }) {
  const exam = mockStaffExams.find((e) => e.id === params.id);
  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <Link href="/staff/exams" className="text-xs text-blue-600 hover:underline">
          &larr; Back to CBT Exams
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">{exam.title} Analytics</h1>
        <p className="text-sm text-slate-500">
          Target Class: {exam.className} • Subject: {exam.subject} • Total Marks: {exam.totalMarks}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Average Score</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">48.2 / 60</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">80.3% Mean Class Score</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Highest Score</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">58 / 60</div>
          <div className="text-xs text-slate-500 mt-1">Achieved by David Okafor</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Completion Rate</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">100%</div>
          <div className="text-xs text-slate-500 mt-1">38 of 38 Students Completed</div>
        </div>
      </div>
    </div>
  );
}
