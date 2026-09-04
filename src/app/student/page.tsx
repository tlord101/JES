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

export default function StudentDashboardPage() {
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
                Student Portal
              </span>
              <span className="text-xs text-[var(--muted-text)]">• Class: SS 2 Science A</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--primary-dark)]">
              Welcome back, {user ? user.name : 'Student'}
            </h1>
            <p className="text-xs text-[var(--muted-text)]">
              Diligence for Excellence — Track your assignments, timetable, and CA grades.
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

        {/* Student Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Overall Term Average</span>
              <i className="bi bi-award-fill text-lg text-amber-500"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">89.4%</div>
            <div className="text-[11px] text-green-700 font-semibold">Rank: 2nd out of 42 students</div>
          </div>

          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Term Attendance</span>
              <i className="bi bi-check-circle-fill text-lg text-green-600"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">97.8%</div>
            <div className="text-[11px] text-slate-500">44 out of 45 days present</div>
          </div>

          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Registered Subjects</span>
              <i className="bi bi-book-fill text-lg text-[var(--primary)]"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">9 Subjects</div>
            <div className="text-[11px] text-slate-500">WAEC / NECO Science Track</div>
          </div>

          <div className="bg-white p-5 border border-[var(--border)] rounded space-y-2">
            <div className="flex justify-between items-center text-[var(--muted-text)]">
              <span className="text-xs font-bold">Active Co-Curricular</span>
              <i className="bi bi-controller text-lg text-[var(--primary)]"></i>
            </div>
            <div className="text-2xl font-extrabold text-[var(--primary-dark)]">Chess Club</div>
            <div className="text-[11px] text-slate-500 font-semibold">Weekly Practice: Thursdays</div>
          </div>
        </div>

        {/* Timetable and Subject Grades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-journal-text text-[var(--primary)]"></i>
                <span>Subject Assessment Summary (Term 2)</span>
              </h2>
              <div className="space-y-2 text-xs">
                {[
                  { subject: 'Mathematics', teacher: 'Mr. O. Aghedo', score: '88/100', grade: 'A' },
                  { subject: 'English Language', teacher: 'Mrs. C. Nwachukwu', score: '82/100', grade: 'A' },
                  { subject: 'Physics', teacher: 'Engr. K. Igbinovia', score: '92/100', grade: 'A+' },
                  { subject: 'Chemistry', teacher: 'Dr. (Mrs.) B. Osagie', score: '85/100', grade: 'A' },
                  { subject: 'Biology', teacher: 'Mr. E. Amadasun', score: '90/100', grade: 'A+' },
                  { subject: 'Further Mathematics', teacher: 'Mr. O. Aghedo', score: '95/100', grade: 'A+' },
                ].map((row, idx) => (
                  <div key={idx} className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[var(--primary-dark)]">{row.subject}</div>
                      <div className="text-[11px] text-[var(--muted-text)]">Instructor: {row.teacher}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[var(--text)]">{row.score}</div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded inline-block mt-0.5">
                        Grade {row.grade}
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
                <i className="bi bi-clock-history text-[var(--primary)]"></i>
                <span>Today's Classes</span>
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <div className="font-bold text-[var(--primary-dark)]">Physics (Lab Practical)</div>
                  <div className="text-[11px] text-[var(--muted-text)] font-mono">08:30 AM - 09:45 AM</div>
                </div>
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <div className="font-bold text-[var(--primary-dark)]">Further Mathematics</div>
                  <div className="text-[11px] text-[var(--muted-text)] font-mono">10:15 AM - 11:30 AM</div>
                </div>
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded">
                  <div className="font-bold text-[var(--primary-dark)]">Chemistry (Organic Reactions)</div>
                  <div className="text-[11px] text-[var(--muted-text)] font-mono">12:00 PM - 01:15 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
