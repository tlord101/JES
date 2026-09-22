/**
 * Sidebar navigation for every authenticated portal.
 *
 * Centralised so each portal layout stays a thin server component and the
 * navigation can be filtered by role in one place.
 */
export type NavItem = {
  label: string;
  href: string;
  icon: string;
  /** Only show the link when the predicate passes (role based filtering). */
  roles?: string[];
};

export type NavGroup = {
  title?: string;
  items: NavItem[];
};

export const ADMIN_NAV: NavGroup[] = [
  {
    items: [{ label: 'Dashboard', href: '/admin', icon: 'bi-speedometer2' }],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'News', href: '/admin/news', icon: 'bi-newspaper' },
      { label: 'Events', href: '/admin/events', icon: 'bi-calendar-event' },
      { label: 'Gallery', href: '/admin/gallery', icon: 'bi-images' },
      { label: 'Pages', href: '/admin/pages', icon: 'bi-file-earmark-text' },
      { label: 'FAQs', href: '/admin/faqs', icon: 'bi-question-circle' },
      { label: 'Calendar', href: '/admin/calendar', icon: 'bi-calendar3' },
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
      { label: 'Attendance', href: '/admin/attendance', icon: 'bi-clipboard-check' },
      { label: 'Results', href: '/admin/results', icon: 'bi-bar-chart' },
    ],
  },
  {
    title: 'PEOPLE',
    items: [
      { label: 'Users', href: '/admin/users', icon: 'bi-shield-person' },
      { label: 'Staff', href: '/admin/staff', icon: 'bi-person-badge' },
      { label: 'Parents', href: '/admin/parents', icon: 'bi-house-heart' },
      { label: 'Alumni', href: '/admin/alumni', icon: 'bi-mortarboard' },
    ],
  },
  {
    title: 'ADMISSIONS',
    items: [
      { label: 'Applications', href: '/admin/applications', icon: 'bi-file-person' },
      { label: 'Sessions', href: '/admin/academic-sessions', icon: 'bi-calendar-range' },
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
    title: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: 'bi-gear' },
      { label: 'Messages', href: '/admin/messages', icon: 'bi-envelope' },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'bi-journal-text' },
    ],
  },
];

export const STAFF_NAV: NavGroup[] = [
  {
    items: [{ label: 'Dashboard', href: '/staff/dashboard', icon: 'bi-speedometer2' }],
  },
  {
    title: 'TEACHING',
    items: [
      { label: 'My Classes', href: '/staff/my-classes', icon: 'bi-building' },
      { label: 'Attendance', href: '/staff/attendance', icon: 'bi-clipboard-check' },
      { label: 'Results Entry', href: '/staff/results-entry', icon: 'bi-pencil-square' },
      { label: 'My Students', href: '/staff/students', icon: 'bi-people' },
    ],
  },
  {
    title: 'SCHOOL',
    items: [{ label: 'My Profile', href: '/profile', icon: 'bi-person-circle' }],
  },
];

export const PARENT_NAV: NavGroup[] = [
  {
    items: [{ label: 'Dashboard', href: '/parent', icon: 'bi-speedometer2' }],
  },
  {
    title: 'MY CHILDREN',
    items: [
      { label: 'Children', href: '/parent/children', icon: 'bi-people' },
      { label: 'Results', href: '/parent/results', icon: 'bi-bar-chart' },
      { label: 'Attendance', href: '/parent/attendance', icon: 'bi-clipboard-check' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Invoices', href: '/parent/fees', icon: 'bi-receipt' },
      { label: 'Payments', href: '/parent/payments', icon: 'bi-credit-card' },
    ],
  },
  {
    title: 'SCHOOL',
    items: [
      { label: 'Messages', href: '/parent/messages', icon: 'bi-envelope' },
      { label: 'My Profile', href: '/profile', icon: 'bi-person-circle' },
    ],
  },
];

export const STUDENT_NAV: NavGroup[] = [
  {
    items: [{ label: 'Dashboard', href: '/student', icon: 'bi-speedometer2' }],
  },
  {
    title: 'ACADEMICS',
    items: [
      { label: 'Timetable', href: '/student/timetable', icon: 'bi-table' },
      { label: 'Results', href: '/student/results', icon: 'bi-bar-chart' },
      { label: 'Attendance', href: '/student/attendance', icon: 'bi-clipboard-check' },
      { label: 'Assignments', href: '/student/assignments', icon: 'bi-journal-check' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [{ label: 'My Profile', href: '/profile', icon: 'bi-person-circle' }],
  },
];

export function filterNav(nav: NavGroup[], role: string): NavGroup[] {
  return nav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}
