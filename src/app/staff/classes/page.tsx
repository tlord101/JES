import React from 'react';
import Link from 'next/link';
import { mockStaffProfile } from '@/lib/staffData';

export default function StaffClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Assigned Classes</h1>
          <p className="text-sm text-slate-500">Classes assigned to you for instruction and form teacher duties.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockStaffProfile.assignedClasses.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                  {cls.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{cls.name}</h2>
              </div>
              {cls.isFormTeacher && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  Form Teacher
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block">Total Students</span>
                <span className="font-bold text-slate-800 text-sm">{cls.studentCount} Students</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Classroom</span>
                <span className="font-bold text-slate-800 text-sm">{cls.room}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/staff/classes/${cls.id}`}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold text-center transition-colors"
              >
                Class Roster
              </Link>
              <Link
                href={`/staff/attendance/${cls.id}`}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold text-center transition-colors"
              >
                Mark Register
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
