'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface StaffSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function StaffSidebar({ mobileOpen, setMobileOpen }: StaffSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/staff', icon: 'bi-grid-1x2-fill' },
    { label: 'My Profile', href: '/staff/profile', icon: 'bi-person-badge-fill' },
    { label: 'My Classes', href: '/staff/classes', icon: 'bi-door-open-fill' },
    { label: 'My Subjects', href: '/staff/subjects', icon: 'bi-book-half' },
    { label: 'Students', href: '/staff/students', icon: 'bi-people-fill' },
    { label: 'Attendance', href: '/staff/attendance', icon: 'bi-calendar-check-fill' },
    { label: 'Assignments', href: '/staff/assignments', icon: 'bi-file-earmark-text-fill' },
    { label: 'CBT / Exams', href: '/staff/exams', icon: 'bi-laptop-fill' },
    { label: 'Question Bank', href: '/staff/question-bank', icon: 'bi-patch-question-fill' },
    { label: 'Results', href: '/staff/results', icon: 'bi-trophy-fill' },
    { label: 'Lesson Materials', href: '/staff/materials', icon: 'bi-folder-symlink-fill' },
    { label: 'Announcements', href: '/staff/announcements', icon: 'bi-megaphone-fill' },
    { label: 'Messages', href: '/staff/messages', icon: 'bi-chat-left-dots-fill' },
    { label: 'Calendar', href: '/staff/calendar', icon: 'bi-calendar-event-fill' },
    { label: 'Settings', href: '/staff/settings', icon: 'bi-gear-fill' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#081B38] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/staff" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
              JES
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-wide uppercase">Staff Portal</div>
              <div className="text-xs text-blue-300 font-medium">Jasmine Exclusive</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/staff'
                ? pathname === '/staff'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <i className={`bi ${item.icon} ${isActive ? 'text-white' : 'text-slate-400'} text-base`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer / Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#051329]">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors w-full"
          >
            <i className="bi bi-box-arrow-right text-base text-red-400"></i>
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
