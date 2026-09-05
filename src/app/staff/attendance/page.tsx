import React from 'react';
import Link from 'next/link';
import { mockStaffProfile } from '@/lib/staffData';

export default function StaffAttendanceOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance Registers</h1>
        <p className="text-sm text-slate-500">Select a class to take or update daily attendance registers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockStaffProfile.assignedClasses.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{cls.name}</h2>
                <p className="text-xs text-slate-500">{cls.studentCount} Enrolled • Room: {cls.room}</p>
              </div>
              {cls.isFormTeacher && (
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  Form Teacher Register
                </span>
              )}
            </div>

            <Link
              href={`/staff/attendance/${cls.id}`}
              className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center transition-colors"
            >
              Mark Register for {cls.name} &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
