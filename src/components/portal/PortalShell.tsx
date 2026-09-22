'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOutAction } from '@/lib/auth/actions';
import type { NavGroup } from '@/lib/navigation';

export type PortalShellUser = {
  fullName: string;
  email: string;
  roleLabel: string;
  avatarUrl?: string | null;
};

export default function PortalShell({
  user,
  nav,
  portalName,
  homeHref,
  children,
}: {
  user: PortalShellUser;
  nav: NavGroup[];
  portalName: string;
  homeHref: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== homeHref && pathname.startsWith(`${href}/`));

  return (
    <div className="min-h-screen bg-[var(--soft-bg)] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 flex-shrink-0 bg-[var(--primary-dark)] text-white lg:min-h-screen`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-[var(--primary-dark)] font-bold rounded flex items-center justify-center text-sm">
            JES
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight truncate">Jasmine Exclusive School</p>
            <p className="text-[11px] text-slate-300 truncate">{portalName}</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1 text-slate-300 hover:text-white"
            aria-label="Close navigation"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="p-3 space-y-4" aria-label={`${portalName} navigation`}>
          {nav.map((group, index) => (
            <div key={group.title ?? `group-${index}`} className="space-y-1">
              {group.title ? (
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400">
                  {group.title}
                </p>
              ) : null}
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-white text-[var(--primary-dark)]'
                      : 'text-slate-200 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <i className={`bi ${item.icon} text-sm`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white"
          >
            <i className="bi bi-box-arrow-up-right"></i>
            <span>Visit public website</span>
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[var(--border)] sticky top-0 z-30 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="lg:hidden p-2 text-[var(--text)] hover:bg-[var(--soft-bg)] rounded"
              aria-label="Toggle navigation sidebar"
            >
              <i className="bi bi-list text-xl"></i>
            </button>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--primary-dark)] truncate">{portalName}</p>
              <p className="text-[11px] text-[var(--muted-text)] truncate">
                Diligence for Excellence &middot; Aduwawa, Benin City
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[var(--text)] truncate max-w-[180px]">
                {user.fullName}
              </p>
              <p className="text-[11px] text-[var(--muted-text)]">{user.roleLabel}</p>
            </div>
            <div className="w-9 h-9 rounded bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold flex items-center justify-center text-xs border border-[var(--border)]">
              {user.fullName.slice(0, 1).toUpperCase()}
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="px-2.5 py-1.5 text-[11px] font-bold border border-[var(--border)] rounded text-[var(--text)] hover:bg-[var(--soft-bg)] flex items-center gap-1.5"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
