import React from 'react';
import { mockStaffProfile } from '@/lib/staffData';

export default function StaffProfilePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#0F2C59] text-white text-2xl font-bold flex items-center justify-center shadow-sm">
            BA
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{mockStaffProfile.name}</h1>
            <p className="text-sm text-slate-600 font-medium">{mockStaffProfile.role}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <i className="bi bi-card-text text-blue-600"></i> Staff ID: {mockStaffProfile.staffId}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="bi bi-building text-blue-600"></i> Dept: {mockStaffProfile.department}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="bi bi-envelope text-blue-600"></i> {mockStaffProfile.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Academic Qualifications & Credentials
          </h2>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Degrees Held
            </div>
            <div className="text-sm font-semibold text-slate-900">{mockStaffProfile.qualification}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Official Phone Line
            </div>
            <div className="text-sm font-semibold text-slate-900">{mockStaffProfile.phone}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Assigned Teaching Subjects
          </h2>
          <div className="space-y-3">
            {mockStaffProfile.assignedSubjects.map((subj) => (
              <div key={subj.id} className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-slate-900">{subj.name} ({subj.code})</div>
                  <div className="text-xs text-slate-500">{subj.classes.join(', ')}</div>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {subj.totalStudents} Students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
