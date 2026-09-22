'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboardPage() {
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
              {user ? user.role : 'Administrative Access'}
            </span>
            <span className="text-xs text-[var(--muted-text)]">• Active Portal Session</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)] mt-1">
            Welcome, {user ? user.name : 'Administrator'}
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Jasmine Exclusive School — Administrative & Institutional Management Overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/news/create"
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Post News</span>
          </Link>
          <Link
            href="/admin/students"
            className="px-4 py-2 border border-[var(--border)] text-[var(--text)] text-xs font-bold rounded hover:bg-[var(--soft-bg)] transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-person-plus"></i>
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-1">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold">Total Enrolled Students</span>
            <i className="bi bi-people-fill text-lg text-[var(--primary)]"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">850</div>
          <div className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
            <i className="bi bi-arrow-up-short"></i> +5.2% from last term
          </div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-1">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold">Academic & Admin Staff</span>
            <i className="bi bi-person-badge-fill text-lg text-[var(--primary)]"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">48</div>
          <div className="text-[11px] text-slate-500 font-semibold">100% active teaching staff</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-1">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold">Registered Parents</span>
            <i className="bi bi-house-heart-fill text-lg text-[var(--primary)]"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">620</div>
          <div className="text-[11px] text-green-700 font-semibold">92% email verified</div>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-1">
          <div className="flex justify-between items-center text-[var(--muted-text)]">
            <span className="text-xs font-bold">Pending Admissions</span>
            <i className="bi bi-hourglass-split text-lg text-amber-600"></i>
          </div>
          <div className="text-2xl font-black text-[var(--primary-dark)]">14</div>
          <div className="text-[11px] text-amber-700 font-semibold">Applications awaiting review</div>
        </div>
      </div>

      {/* Operational Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[var(--muted-text)] uppercase tracking-wider">Today's Student Attendance</div>
            <div className="text-xl font-bold text-[var(--primary-dark)]">96.8%</div>
            <div className="text-[11px] text-slate-500">823 present / 27 absent</div>
          </div>
          <i className="bi bi-calendar-check text-2xl text-green-600"></i>
        </div>

        <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[var(--muted-text)] uppercase tracking-wider">Upcoming Term Exams</div>
            <div className="text-xl font-bold text-[var(--primary-dark)]">Term 2 CA II</div>
            <div className="text-[11px] text-slate-500">Starts Monday, March 10, 2025</div>
          </div>
          <i className="bi bi-journal-check text-2xl text-[var(--primary)]"></i>
        </div>

        <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[var(--muted-text)] uppercase tracking-wider">Outstanding Term Fees</div>
            <div className="text-xl font-bold text-amber-700">₦2,450,000</div>
            <div className="text-[11px] text-slate-500">88.5% total fees collected</div>
          </div>
          <i className="bi bi-cash text-2xl text-amber-600"></i>
        </div>
      </div>

      {/* Main Tables & Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Bursary Payments */}
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-receipt text-[var(--primary)]"></i>
                <span>Recent Fee Payments</span>
              </h2>
              <Link href="/admin/payments" className="text-xs font-bold text-[var(--primary)] hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--soft-bg)] text-[var(--muted-text)] font-semibold">
                    <th className="p-2.5">Receipt No</th>
                    <th className="p-2.5">Student</th>
                    <th className="p-2.5">Class</th>
                    <th className="p-2.5">Amount</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    { id: 'REC-2025-001', name: 'David Okafor', class: 'SS 1 Blue', amount: '₦185,000', date: 'Feb 12, 2025', status: 'Cleared' },
                    { id: 'REC-2025-002', name: 'Chinecherem Okafor', class: 'JSS 2 Gold', amount: '₦165,000', date: 'Feb 12, 2025', status: 'Cleared' },
                    { id: 'REC-2025-003', name: 'Osasere Ighodaro', class: 'JSS 1 Red', amount: '₦165,000', date: 'Feb 11, 2025', status: 'Cleared' },
                    { id: 'REC-2025-004', name: 'Blessing Osagie', class: 'SS 3 Arts', amount: '₦195,000', date: 'Feb 10, 2025', status: 'Cleared' },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-[var(--soft-bg)] transition-colors">
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[var(--primary-dark)]">{row.id}</td>
                      <td className="p-2.5 font-bold text-[var(--text)]">{row.name}</td>
                      <td className="p-2.5 text-[var(--muted-text)]">{row.class}</td>
                      <td className="p-2.5 font-bold text-[var(--text)]">{row.amount}</td>
                      <td className="p-2.5 text-[var(--muted-text)]">{row.date}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-file-earmark-person text-[var(--primary)]"></i>
                <span>Recent Admission Applications</span>
              </h2>
              <Link href="/admin/applications" className="text-xs font-bold text-[var(--primary)] hover:underline">
                View All Applications
              </Link>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { name: 'Eseosa Enabulele', class: 'Primary 4', parent: 'Engr. O. Enabulele', phone: '+234 802 334 5566', date: 'Feb 13, 2025', status: 'Pending Review' },
                { name: 'Godswill Amadasun', class: 'JSS 1', parent: 'Mrs. F. Amadasun', phone: '+234 805 112 3344', date: 'Feb 12, 2025', status: 'Exam Scheduled' },
                { name: 'Miracle Igbinovia', class: 'SS 1 Science', parent: 'Mr. P. Igbinovia', phone: '+234 803 998 7766', date: 'Feb 10, 2025', status: 'Interview Completed' },
              ].map((app, idx) => (
                <div key={idx} className="p-3.5 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="font-bold text-[var(--primary-dark)] text-sm">{app.name}</div>
                    <div className="text-[11px] text-[var(--muted-text)]">
                      Applying for: <strong>{app.class}</strong> • Parent: {app.parent} ({app.phone})
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">
                      {app.status}
                    </span>
                    <button className="px-3 py-1 bg-white border border-[var(--border)] text-[var(--text)] font-bold text-xs rounded hover:bg-[var(--soft-bg)]">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements & Quick Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
            <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
              <i className="bi bi-megaphone text-[var(--primary)]"></i>
              <span>Recent Portal Announcements</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1">
                <div className="font-bold text-[var(--primary-dark)]">Second Term PTA General Meeting</div>
                <p className="text-[11px] text-[var(--muted-text)]">Scheduled for Saturday, February 22, 2025 at 10:00 AM.</p>
                <div className="text-[10px] text-slate-400">Posted on Feb 08, 2025</div>
              </div>

              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-1">
                <div className="font-bold text-[var(--primary-dark)]">Mid-Term Break Resumption Notice</div>
                <p className="text-[11px] text-[var(--muted-text)]">All boarders return on Sunday evening before 6:00 PM.</p>
                <div className="text-[10px] text-slate-400">Posted on Feb 05, 2025</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-[var(--border)] rounded space-y-3 text-xs">
            <h2 className="font-bold text-[var(--primary-dark)] uppercase tracking-wider text-[11px]">
              System Health & Status
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-text)]">CMS Engine Status:</span>
                <span className="font-bold text-green-700">Online / Sync Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-text)]">Role Engine (RBAC):</span>
                <span className="font-bold text-green-700">10 Active Roles</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-text)]">Audit Logging:</span>
                <span className="font-bold text-green-700">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
