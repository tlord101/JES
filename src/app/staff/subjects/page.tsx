import React from 'react';
import { mockStaffProfile } from '@/lib/staffData';

export default function StaffSubjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Assigned Teaching Subjects</h1>
        <p className="text-sm text-slate-500">Subjects and curriculum streams assigned for current academic term.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockStaffProfile.assignedSubjects.map((subj) => (
          <div key={subj.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
              {subj.code.slice(0, 3)}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{subj.name}</h2>
            <div className="text-xs text-slate-500">Subject Code: {subj.code}</div>
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Classes:</span>
                <span className="font-semibold text-slate-800">{subj.classes.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Enrolled:</span>
                <span className="font-semibold text-slate-800">{subj.totalStudents} Students</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
