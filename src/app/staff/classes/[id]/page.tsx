import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockStaffProfile, mockStaffStudents } from '@/lib/staffData';

export default function StaffClassDetailPage({ params }: { params: { id: string } }) {
  const cls = mockStaffProfile.assignedClasses.find((c) => c.id === params.id);
  if (!cls) {
    notFound();
  }

  const classStudents = mockStaffStudents.filter((s) => s.classId === cls.id);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/staff/classes" className="text-xs text-blue-600 hover:underline">
              &larr; Back to Classes
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{cls.name} Class Roster</h1>
          <p className="text-sm text-slate-500">
            {cls.category} • {cls.room} • {cls.studentCount} Registered Students
          </p>
        </div>
        <Link
          href={`/staff/attendance/${cls.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors inline-block text-center"
        >
          Take Attendance Register
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Class Roster ({classStudents.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-2.5 px-3">Admission No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Gender</th>
                <th className="py-2.5 px-3">Guardian</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-medium text-slate-600">{std.admissionNo}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{std.name}</td>
                  <td className="py-3 px-3 text-slate-600">{std.gender}</td>
                  <td className="py-3 px-3 text-slate-600">{std.guardianName}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">{std.attendanceRate}%</td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/staff/students/${std.id}`}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      View Student
                    </Link>
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
