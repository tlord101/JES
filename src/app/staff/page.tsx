import React from 'react';
import Link from 'next/link';
import {
  mockStaffProfile,
  mockStaffStudents,
  mockStaffAssignments,
  mockStaffExams,
} from '@/lib/staffData';

export default function StaffDashboard() {
  const pendingGradingCount = mockStaffAssignments.reduce(
    (acc, asg) => acc + asg.submissions.filter((s) => s.status === 'submitted').length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#0F2C59] text-white rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-800 text-blue-200 text-xs font-semibold rounded-full mb-3">
              Teacher Dashboard
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {mockStaffProfile.name}!</h1>
            <p className="text-slate-300 text-sm mt-1">
              {mockStaffProfile.role} • {mockStaffProfile.department} Department
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/staff/attendance"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i className="bi bi-calendar-check"></i>
              Take Attendance
            </Link>
            <Link
              href="/staff/results/enter"
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i className="bi bi-pencil-square"></i>
              Enter Marks
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Classes</span>
            <i className="bi bi-door-open text-lg text-blue-600"></i>
          </div>
          <div className="text-2xl font-bold text-slate-900">{mockStaffProfile.assignedClasses.length}</div>
          <p className="text-xs text-slate-500 mt-1">SS 1 Blue (Form), JSS 2 Gold</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Subjects</span>
            <i className="bi bi-book text-lg text-emerald-600"></i>
          </div>
          <div className="text-2xl font-bold text-slate-900">{mockStaffProfile.assignedSubjects.length}</div>
          <p className="text-xs text-slate-500 mt-1">Maths, F.Maths, Basic Tech</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Grading</span>
            <i className="bi bi-hourglass-split text-lg text-amber-600"></i>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingGradingCount} Submissions</div>
          <p className="text-xs text-amber-600 font-medium mt-1">Requires review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming CBT</span>
            <i className="bi bi-laptop text-lg text-indigo-600"></i>
          </div>
          <div className="text-2xl font-bold text-slate-900">{mockStaffExams.length} Scheduled</div>
          <p className="text-xs text-slate-500 mt-1">Next: April 10, 2025</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Class Roster Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Teaching Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i className="bi bi-clock-history text-blue-600"></i>
                Today's Schedule & Classes
              </h2>
              <Link href="/staff/timetable" className="text-xs font-semibold text-blue-600 hover:underline">
                Full Timetable &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                    08:30
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Mathematics • SS 1 Blue</div>
                    <div className="text-xs text-slate-500">Room B-12 • Quadratic Equations</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    11:15
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Further Mathematics • SS 1 Blue</div>
                    <div className="text-xs text-slate-500">Room B-12 • Differentiation & Integration</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Next Period
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                    13:45
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Basic Technology • JSS 2 Gold</div>
                    <div className="text-xs text-slate-500">Room A-08 • Workshop Tools</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          {/* Student Academic & Attendance Highlights */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <i className="bi bi-people text-blue-600"></i>
                Authorized Students Highlight
              </h2>
              <Link href="/staff/students" className="text-xs font-semibold text-blue-600 hover:underline">
                View All Students &rarr;
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase bg-slate-50">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Term Average</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockStaffStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-3 px-3 text-slate-600">{student.className}</td>
                      <td className="py-3 px-3 text-emerald-700 font-medium">{student.attendanceRate}%</td>
                      <td className="py-3 px-3 font-bold text-blue-700">{student.averageGrade}%</td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/staff/students/${student.id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-medium transition-colors"
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

        {/* Right Col: Quick Actions & Tasks */}
        <div className="space-y-6">
          {/* Quick Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="bi bi-check2-square text-blue-600"></i>
              Teacher Action Center
            </h2>
            <div className="space-y-3">
              <Link
                href="/staff/attendance/ss1-blue"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-between transition-colors block"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">Mark SS 1 Blue Register</div>
                  <div className="text-xs text-slate-500">Form Teacher Daily Attendance</div>
                </div>
                <i className="bi bi-chevron-right text-slate-400"></i>
              </Link>

              <Link
                href="/staff/assignments/asg-301/grade"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-between transition-colors block"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">Grade Quadratic Homework</div>
                  <div className="text-xs text-amber-600 font-medium">2 pending submissions</div>
                </div>
                <i className="bi bi-chevron-right text-slate-400"></i>
              </Link>

              <Link
                href="/staff/question-bank"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-between transition-colors block"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">CBT Question Bank</div>
                  <div className="text-xs text-slate-500">7 questions created</div>
                </div>
                <i className="bi bi-chevron-right text-slate-400"></i>
              </Link>
            </div>
          </div>

          {/* Assigned Classes Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i className="bi bi-building text-blue-600"></i>
              Assigned Classes
            </h2>
            <div className="space-y-3">
              {mockStaffProfile.assignedClasses.map((cls) => (
                <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{cls.name}</span>
                    {cls.isFormTeacher && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                        Form Teacher
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>{cls.studentCount} Students</span>
                    <span>{cls.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
