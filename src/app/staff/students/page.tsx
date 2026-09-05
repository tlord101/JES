import React from 'react';
import Link from 'next/link';
import { mockStaffStudents } from '@/lib/staffData';

export default function StaffStudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Authorized Students Directory</h1>
        <p className="text-sm text-slate-500">
          Viewing students enrolled in your assigned classes and subject sections.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Guardian Contact</th>
                <th className="py-3 px-3">Term Avg</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStaffStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-3 font-medium text-slate-600">{student.admissionNo}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{student.name}</td>
                  <td className="py-3.5 px-3 text-slate-700">{student.className}</td>
                  <td className="py-3.5 px-3 text-slate-600">
                    <div>{student.guardianName}</div>
                    <div className="text-xs text-slate-400">{student.guardianPhone}</div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-blue-700">{student.averageGrade}%</td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href={`/staff/students/${student.id}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Profile
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
