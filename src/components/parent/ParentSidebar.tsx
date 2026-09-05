'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavItem {
  label: string;
  href: string;
  icon: string;
}

const PARENT_NAVIGATION: SidebarNavItem[] = [
  { label: 'Dashboard', href: '/parent', icon: 'bi-speedometer2' },
  { label: 'My Children', href: '/parent/children', icon: 'bi-people' },
  { label: 'Results', href: '/parent/results', icon: 'bi-award' },
  { label: 'Fees', href: '/parent/fees', icon: 'bi-cash-stack' },
  { label: 'Assignments', href: '/parent/assignments', icon: 'bi-file-earmark-text' },
  { label: 'Exams', href: '/parent/exams', icon: 'bi-card-checklist' },
  { label: 'Attendance', href: '/parent/attendance', icon: 'bi-check2-square' },
  { label: 'Timetable', href: '/parent/timetable', icon: 'bi-clock-history' },
  { label: 'Announcements', href: '/parent/announcements', icon: 'bi-megaphone' },
  { label: 'School Calendar', href: '/parent/calendar', icon: 'bi-calendar3' },
  { label: 'PTA', href: '/parent/pta', icon: 'bi-people-fill' },
  { label: 'Messages', href: '/parent/messages', icon: 'bi-chat-dots' },
  { label: 'Profile', href: '/parent/profile', icon: 'bi-person-badge' },
  { label: 'Settings', href: '/parent/settings', icon: 'bi-gear' },
];

export default function ParentSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[var(--primary-dark)] text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <Link href="/parent" className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 bg-white text-[var(--primary-dark)] font-black rounded flex items-center justify-center text-sm shadow-sm">
              JES
            </div>
            <div>
              <div className="text-xs font-bold leading-tight uppercase tracking-wider text-slate-200">
                Parent Portal
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                Jasmine Exclusive
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white text-lg p-1"
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs font-medium">
          {PARENT_NAVIGATION.map((item) => {
            const isActive =
              item.href === '/parent'
                ? pathname === '/parent'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[var(--primary)] text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`bi ${item.icon} text-base flex-shrink-0`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-700">
          <Link
            href="/auth/logout"
            className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-300 hover:bg-red-900/40 hover:text-red-100 rounded transition-colors"
          >
            <i className="bi bi-box-arrow-right text-base"></i>
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
