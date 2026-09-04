'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface UserSession {
  name: string;
  email: string;
  role: string;
}

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [user, setUser] = useState<UserSession | null>(null);

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
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[var(--text)] hover:bg-[var(--soft-bg)] rounded"
          aria-label="Toggle Navigation Sidebar"
        >
          <i className="bi bi-list text-xl"></i>
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-bold text-[var(--primary-dark)]">
            Jasmine Exclusive School Administrative System
          </span>
          <span className="text-[11px] text-[var(--muted-text)] block">
            Diligence for Excellence • Edo State, Nigeria
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search portal records..."
            className="w-56 pl-8 pr-3 py-1.5 text-xs border border-[var(--border)] rounded bg-[var(--soft-bg)] focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2 text-[var(--muted-text)]"></i>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-3 border-l border-[var(--border)] pl-4">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-[var(--text)]">{user ? user.name : 'Administrator'}</div>
            <div className="text-[11px] text-[var(--muted-text)]">{user ? user.role : 'Super Admin'}</div>
          </div>
          <Link
            href="/profile"
            className="w-8 h-8 bg-[var(--primary)] text-white font-bold rounded-full flex items-center justify-center text-xs hover:bg-[var(--primary-dark)] transition-colors"
          >
            {user?.name ? user.name.charAt(0) : 'A'}
          </Link>
        </div>
      </div>
    </header>
  );
}
