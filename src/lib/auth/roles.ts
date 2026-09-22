import type { UserRole } from '@/types/database';

/** Human readable role names used across the portals. */
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Administrator',
  admin: 'Administrator',
  principal: 'Principal',
  vice_principal: 'Vice Principal',
  hod: 'Head of Department',
  teacher: 'Teacher',
  accountant: 'Accountant',
  parent: 'Parent / Guardian',
  student: 'Student',
  alumni: 'Alumni',
};

/** Where each role lands after a successful sign-in. */
export const ROLE_HOME: Record<UserRole, string> = {
  super_admin: '/admin',
  admin: '/admin',
  principal: '/admin',
  vice_principal: '/admin',
  accountant: '/admin',
  hod: '/staff',
  teacher: '/staff',
  parent: '/parent',
  student: '/student',
  alumni: '/profile',
};

/** Roles that may open the administration portal. */
export const ADMIN_PORTAL_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'principal',
  'vice_principal',
  'accountant',
];

/** Roles that may open the teaching portal. */
export const STAFF_PORTAL_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'principal',
  'vice_principal',
  'hod',
  'teacher',
];

export const PARENT_PORTAL_ROLES: UserRole[] = ['parent', 'super_admin', 'admin'];
export const STUDENT_PORTAL_ROLES: UserRole[] = ['student', 'super_admin', 'admin'];

/** Every role that is allowed to reach the shared profile page. */
export const ALL_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'principal',
  'vice_principal',
  'hod',
  'teacher',
  'accountant',
  'parent',
  'student',
  'alumni',
];

/** Roles on the school payroll. */
export const SCHOOL_STAFF_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'principal',
  'vice_principal',
  'hod',
  'teacher',
  'accountant',
];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && value in ROLE_LABELS;
}

export function roleLabel(role: UserRole | null | undefined): string {
  return role ? ROLE_LABELS[role] : 'Guest';
}

export function roleHome(role: UserRole | null | undefined): string {
  return role ? ROLE_HOME[role] : '/login';
}

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canAccessAdminPortal(role: UserRole | null | undefined): boolean {
  return role ? ADMIN_PORTAL_ROLES.includes(role) : false;
}

export function canAccessStaffPortal(role: UserRole | null | undefined): boolean {
  return role ? STAFF_PORTAL_ROLES.includes(role) : false;
}

export function canManageContent(role: UserRole | null | undefined): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'principal';
}

export function canManageUsers(role: UserRole | null | undefined): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canManageFinance(role: UserRole | null | undefined): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'accountant';
}

/** Which portal a login screen belongs to. */
export type PortalId = 'admin' | 'staff' | 'parent' | 'student';

export const PORTALS: Record<
  PortalId,
  { title: string; description: string; roles: UserRole[]; icon: string }
> = {
  admin: {
    title: 'Administration Portal',
    description: 'Super administrators, administrators, principals and the bursary.',
    roles: ADMIN_PORTAL_ROLES,
    icon: 'bi-shield-lock',
  },
  staff: {
    title: 'Staff Portal',
    description: 'Teachers, heads of department and academic leadership.',
    roles: STAFF_PORTAL_ROLES,
    icon: 'bi-easel',
  },
  parent: {
    title: 'Parent Portal',
    description: 'Results, attendance, invoices and school communication.',
    roles: PARENT_PORTAL_ROLES,
    icon: 'bi-people',
  },
  student: {
    title: 'Student Portal',
    description: 'Timetable, results, attendance and assignments.',
    roles: STUDENT_PORTAL_ROLES,
    icon: 'bi-mortarboard',
  },
};

export const PORTAL_IDS: PortalId[] = ['admin', 'staff', 'parent', 'student'];

export function isPortalId(value: string | null | undefined): value is PortalId {
  return value === 'admin' || value === 'staff' || value === 'parent' || value === 'student';
}
