import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockStaffStudents } from '@/lib/staffData';

export default function StaffStudentDetailPage({ params }: { params: { id: string } }) {
  const student = mockStaffStudents.find((s) => s.id === params.id);
  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/staff/students" className="text-xs text-blue-600 hover:underline">
              &larr; Back to Students Directory
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{student.name}</h1>
            <p className="text-sm text-slate-500">
              Admission No: {student.admissionNo} • Class: {student.className}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/staff/results/${student.id}`}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Enter / View Results
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Academic Performance Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block uppercase font-semibold">Attendance Rate</span>
              <span className="text-2xl font-bold text-emerald-700">{student.attendanceRate}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block uppercase font-semibold">Term Average</span>
              <span className="text-2xl font-bold text-blue-700">{student.averageGrade}%</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block uppercase font-semibold mb-1">Teacher Conduct Remark</span>
            <p className="text-sm text-slate-800 font-medium">{student.conductRemark}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Guardian & Emergency Information
          </h2>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
            <div>
              <span className="text-xs text-slate-500 block uppercase font-semibold">Guardian Name</span>
              <span className="font-bold text-slate-900">{student.guardianName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block uppercase font-semibold">Phone Number</span>
              <span className="font-semibold text-slate-800">{student.guardianPhone}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block uppercase font-semibold">Gender</span>
              <span className="font-semibold text-slate-800">{student.gender}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
