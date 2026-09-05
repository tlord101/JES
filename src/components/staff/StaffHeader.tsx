'use client';

import React from 'react';
import Link from 'next/link';
import { mockStaffProfile } from '@/lib/staffData';

interface StaffHeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export function StaffHeader({ setMobileOpen }: StaffHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
          aria-label="Open menu"
        >
          <i className="bi bi-list text-xl"></i>
        </button>
        <div>
          <h1 className="text-sm lg:text-base font-bold text-slate-900 leading-tight">
            Teacher & Staff Portal
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Jasmine Exclusive School • Academic Year 2024/2025
          </p>
        </div>
      </div>

      {/* Right: Notifications & Profile Badge */}
      <div className="flex items-center gap-3">
        <Link
          href="/staff/messages"
          className="relative text-slate-600 hover:text-blue-600 p-2 rounded-lg hover:bg-slate-100"
          title="Messages"
        >
          <i className="bi bi-envelope text-lg"></i>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600"></span>
        </Link>

        <Link
          href="/staff/announcements"
          className="relative text-slate-600 hover:text-blue-600 p-2 rounded-lg hover:bg-slate-100"
          title="Announcements"
        >
          <i className="bi bi-bell text-lg"></i>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
        </Link>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        <Link
          href="/staff/profile"
          className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
            BA
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-slate-800">{mockStaffProfile.name}</div>
            <div className="text-[10px] text-slate-500">Science Teacher</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
