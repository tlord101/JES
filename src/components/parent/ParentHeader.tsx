'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function ParentHeader({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
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
    <header className="bg-white border-b border-[var(--border)] sticky top-0 z-30 px-4 py-3 flex items-center justify-between gap-4">
      {/* Left section: Hamburger button & portal title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[var(--text)] hover:bg-[var(--soft-bg)] rounded transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <i className="bi bi-list text-xl"></i>
        </button>
        <div className="hidden sm:block">
          <span className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-wider">
            Parent & Guardian Portal
          </span>
          <h2 className="text-sm font-extrabold text-[var(--primary-dark)]">
            Jasmine Exclusive School
          </h2>
        </div>
      </div>

      {/* Right section: Wards info / Notifications / Profile */}
      <div className="flex items-center gap-3 text-xs">
        <div className="hidden md:flex items-center gap-2 bg-[var(--soft-bg)] border border-[var(--border)] px-3 py-1.5 rounded">
          <i className="bi bi-people-fill text-[var(--primary)] text-sm"></i>
          <span className="font-bold text-[var(--primary-dark)]">Linked Wards: 2 Students</span>
        </div>

        <Link
          href="/parent/messages"
          className="p-2 text-[var(--text)] hover:bg-[var(--soft-bg)] rounded relative transition-colors"
          title="Messages"
        >
          <i className="bi bi-envelope text-lg"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </Link>

        <Link
          href="/parent/announcements"
          className="p-2 text-[var(--text)] hover:bg-[var(--soft-bg)] rounded relative transition-colors"
          title="Announcements"
        >
          <i className="bi bi-bell text-lg"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
        </Link>

        <div className="h-5 w-px bg-[var(--border)]"></div>

        <Link
          href="/parent/profile"
          className="flex items-center gap-2 text-[var(--primary-dark)] hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center font-bold text-xs text-[var(--primary-dark)]">
            {user?.name ? user.name.charAt(0) : 'P'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="font-bold text-xs leading-tight">
              {user?.name || 'Dr. Emmanuel Okafor'}
            </div>
            <div className="text-[10px] text-[var(--muted-text)] font-medium">
              Parent / Guardian
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
