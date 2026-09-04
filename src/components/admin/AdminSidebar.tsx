'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavGroup {
  title?: string;
  items: {
    label: string;
    href: string;
    icon: string;
  }[];
}

const SIDEBAR_NAVIGATION: SidebarNavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/admin', icon: 'bi-speedometer2' },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: 'bi-file-earmark-text' },
      { label: 'News', href: '/admin/news', icon: 'bi-newspaper' },
      { label: 'Events', href: '/admin/events', icon: 'bi-calendar-event' },
      { label: 'Calendar', href: '/admin/calendar', icon: 'bi-calendar3' },
      { label: 'Gallery', href: '/admin/gallery', icon: 'bi-images' },
      { label: 'FAQs', href: '/admin/faqs', icon: 'bi-question-circle' },
      { label: 'Media', href: '/admin/media', icon: 'bi-folder2-open' },
    ],
  },
  {
    title: 'ACADEMICS',
    items: [
      { label: 'Students', href: '/admin/students', icon: 'bi-people' },
      { label: 'Classes', href: '/admin/classes', icon: 'bi-building' },
      { label: 'Subjects', href: '/admin/subjects', icon: 'bi-journal-bookmark' },
      { label: 'Curriculum', href: '/admin/curriculum', icon: 'bi-book' },
    ],
  },
  {
    title: 'PEOPLE',
    items: [
      { label: 'Parents', href: '/admin/parents', icon: 'bi-house-heart' },
      { label: 'Staff', href: '/admin/staff', icon: 'bi-person-badge' },
      { label: 'Users', href: '/admin/users', icon: 'bi-shield-person' },
      { label: 'Roles', href: '/admin/roles', icon: 'bi-key' },
    ],
  },
  {
    title: 'ADMISSIONS',
    items: [
      { label: 'Applications', href: '/admin/applications', icon: 'bi-file-person' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Fees', href: '/admin/fees', icon: 'bi-cash-stack' },
      { label: 'Payments', href: '/admin/payments', icon: 'bi-credit-card' },
    ],
  },
  {
    title: 'COMMUNITY',
    items: [
      { label: 'PTA', href: '/admin/pta', icon: 'bi-people-fill' },
      { label: 'Alumni', href: '/admin/alumni', icon: 'bi-mortarboard' },
      { label: 'Messages', href: '/admin/messages', icon: 'bi-envelope' },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      { label: 'Reports', href: '/admin/reports', icon: 'bi-graph-up' },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'bi-activity' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Notifications', href: '/admin/notifications', icon: 'bi-bell' },
      { label: 'Settings', href: '/admin/settings', icon: 'bi-gear' },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[var(--primary-dark)] text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 bg-white text-[var(--primary-dark)] font-black rounded flex items-center justify-center text-sm shadow-sm">
              JES
            </div>
            <div>
              <div className="text-xs font-bold leading-tight uppercase tracking-wider text-slate-200">
                Admin Control
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                Jasmine Exclusive
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white text-lg p-1"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs font-medium">
          {SIDEBAR_NAVIGATION.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {group.title && (
                <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors ${
                      isActive
                        ? 'bg-[var(--primary)] text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <i className={`bi ${item.icon} text-sm flex-shrink-0`}></i>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-700">
          <Link
            href="/auth/logout"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-900/40 hover:text-red-100 rounded transition-colors"
          >
            <i className="bi bi-box-arrow-right text-sm"></i>
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
