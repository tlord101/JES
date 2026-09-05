import React from 'react';
import Link from 'next/link';
import { mockStaffAssignments } from '@/lib/staffData';

export default function StaffAssignmentsOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignments & Homework</h1>
          <p className="text-sm text-slate-500">Create, review, and grade class assignments.</p>
        </div>
        <Link
          href="/staff/assignments/create"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <i className="bi bi-plus-circle"></i> Create Assignment
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active & Past Assignments</h2>
        <div className="space-y-4">
          {mockStaffAssignments.map((asg) => {
            const pendingCount = asg.submissions.filter((s) => s.status === 'submitted').length;
            return (
              <div
                key={asg.id}
                className="p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                      {asg.className}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{asg.subject}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{asg.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Due Date: {asg.dueDate} • Max Score: {asg.maxScore} marks</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{asg.submissions.length} Submissions</div>
                    {pendingCount > 0 ? (
                      <div className="text-[10px] font-bold text-amber-600">{pendingCount} Pending Grade</div>
                    ) : (
                      <div className="text-[10px] font-bold text-emerald-600">All Graded</div>
                    )}
                  </div>
                  <Link
                    href={`/staff/assignments/${asg.id}/grade`}
                    className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 rounded-xl text-xs font-bold transition-colors"
                  >
                    Grade Work
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
