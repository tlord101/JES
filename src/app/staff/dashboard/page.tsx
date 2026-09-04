'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export default function StaffDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="py-8 bg-[var(--soft-bg)] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Banner */}
        <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
                {user ? user.role : 'Staff Portal'}
              </span>
              <span className="text-xs text-[var(--muted-text)]">• Active Educator Session</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--primary-dark)]">
              Welcome, {user ? user.name : 'Teacher'}
            </h1>
            <p className="text-xs text-[var(--muted-text)]">
              Academic Management, Attendance Register & Gradebook Submission
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="px-4 py-2 border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1.5"
            >
              <i className="bi bi-person-circle"></i>
              <span>My Profile</span>
            </Link>
            <Link
              href="/auth/logout"
              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Sign Out</span>
            </Link>
          </div>
        </div>

        {/* Staff Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Assigned Classes</span>
              <i className="bi bi-journal-bookmark-fill text-lg text-[var(--primary)]"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">3 Classes</div>
            <div className="text-[11px] text-slate-500">JSS 2A, SS 1B, SS 3A</div>
          </div>

          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Total Enrolled Students</span>
              <i className="bi bi-people-fill text-lg text-[var(--primary)]"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">115</div>
            <div className="text-[11px] text-green-700 font-semibold">100% register updated</div>
          </div>

          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Pending Assessment Grades</span>
              <i className="bi bi-pencil-square text-lg text-amber-600"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">2 CA Tests</div>
            <div className="text-[11px] text-amber-700 font-semibold">Due by Friday 4:00 PM</div>
          </div>

          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Weekly Schedule</span>
              <i className="bi bi-calendar-week text-lg text-[var(--primary)]"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">18 Periods</div>
            <div className="text-[11px] text-slate-500 font-semibold">Mathematics & Further Math</div>
          </div>
        </div>

        {/* Timetable & Gradebook Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-card-checklist text-[var(--primary)]"></i>
                <span>Today's Class Schedule & Attendance</span>
              </h2>
              <div className="space-y-3">
                {[
                  { time: '08:30 AM - 09:15 AM', class: 'JSS 2A', subject: 'Mathematics', topic: 'Algebraic Expressions & Factorization', status: 'Completed' },
                  { time: '10:00 AM - 10:45 AM', class: 'SS 1B', subject: 'Further Mathematics', topic: 'Quadratic Equations & Polynomials', status: 'In Progress' },
                  { time: '11:30 AM - 12:15 PM', class: 'SS 3A', subject: 'Mathematics', topic: 'Calculus Differentiation & Applications', status: 'Upcoming' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--primary-dark)] text-sm">{item.class}</span>
                        <span className="px-2 py-0.5 bg-white border border-[var(--border)] text-[var(--text)] font-semibold rounded text-[11px]">
                          {item.subject}
                        </span>
                      </div>
                      <div className="text-[var(--muted-text)] mt-1">Topic: {item.topic}</div>
                    </div>
                    <div className="text-right sm:text-right">
                      <div className="font-mono text-[var(--muted-text)] font-semibold">{item.time}</div>
                      <span className={`inline-block px-2 py-0.5 mt-1 text-[10px] font-bold rounded ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-shield-check text-[var(--primary)]"></i>
                <span>Your Staff Permissions</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(user?.permissions || ['students.view', 'attendance.mark', 'results.input', 'exams.manage']).map((perm) => (
                  <span
                    key={perm}
                    className="px-2.5 py-1 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[11px] font-mono font-bold rounded border border-blue-200"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
