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

export default function ParentDashboardPage() {
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
                Parent / Guardian Portal
              </span>
              <span className="text-xs text-[var(--muted-text)]">• Active Parent Session</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--primary-dark)]">
              Welcome, {user ? user.name : 'Parent'}
            </h1>
            <p className="text-xs text-[var(--muted-text)]">
              Track your wards' academic progress, term report cards, attendance, and fee statements.
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

        {/* Wards Overview Grid */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
          <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
            <i className="bi bi-people text-[var(--primary)]"></i>
            <span>Enrolled Wards</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-[var(--primary-dark)]">David Okafor</h3>
                  <div className="text-xs text-[var(--muted-text)] font-semibold">Class: SS 1 Blue • Reg No: JES/2022/084</div>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                  Active Enrolled
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-text)] font-bold">ATTENDANCE</div>
                  <div className="font-bold text-[var(--primary-dark)] pt-0.5">96.5%</div>
                </div>
                <div className="p-2 bg-white rounded border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-text)] font-bold">TERM AVG</div>
                  <div className="font-bold text-[var(--primary-dark)] pt-0.5">88.4% (A)</div>
                </div>
                <div className="p-2 bg-white rounded border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-text)] font-bold">FEE STATUS</div>
                  <div className="font-bold text-green-700 pt-0.5">Paid</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-[var(--primary-dark)]">Chinecherem Okafor</h3>
                  <div className="text-xs text-[var(--muted-text)] font-semibold">Class: JSS 2 Gold • Reg No: JES/2023/112</div>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 font-bold text-[10px] rounded">
                  Active Enrolled
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-text)] font-bold">ATTENDANCE</div>
                  <div className="font-bold text-[var(--primary-dark)] pt-0.5">98.0%</div>
                </div>
                <div className="p-2 bg-white rounded border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-text)] font-bold">TERM AVG</div>
                  <div className="font-bold text-[var(--primary-dark)] pt-0.5">91.2% (A+)</div>
                </div>
                <div className="p-2 bg-white rounded border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted-text)] font-bold">FEE STATUS</div>
                  <div className="font-bold text-green-700 pt-0.5">Paid</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Academic Reports & PTA Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-file-earmark-bar-graph text-[var(--primary)]"></i>
                <span>Term Results & Report Cards</span>
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[var(--primary-dark)]">First Term Broadsheet (2024/2025) — David Okafor</div>
                    <div className="text-[11px] text-[var(--muted-text)]">Published on Dec 15, 2024 • Principal's Remarks: Outstanding Performance</div>
                  </div>
                  <button className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)]">
                    View Card
                  </button>
                </div>

                <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[var(--primary-dark)]">First Term Broadsheet (2024/2025) — Chinecherem Okafor</div>
                    <div className="text-[11px] text-[var(--muted-text)]">Published on Dec 15, 2024 • Principal's Remarks: Excellent Effort & Conduct</div>
                  </div>
                  <button className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)]">
                    View Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4">
              <h2 className="text-base font-bold text-[var(--primary-dark)] flex items-center gap-2">
                <i className="bi bi-calendar-event text-[var(--primary)]"></i>
                <span>Upcoming PTA Meeting</span>
              </h2>
              <div className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-xs space-y-2">
                <div className="font-bold text-[var(--primary-dark)]">Second Term PTA General Assembly</div>
                <div className="text-[11px] text-[var(--muted-text)]">Date: Saturday, February 22, 2025 @ 10:00 AM</div>
                <div className="text-[11px] text-[var(--muted-text)]">Venue: Main Assembly Hall, Aduwawa Campus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
