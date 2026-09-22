import type { UserRole } from '@/types/database';

/**
 * Permission catalogue.
 *
 * Components never hard-code permission strings: they ask
 * {@link hasPermission} so a change in one place is reflected everywhere.
 */
export const PERMISSIONS = {
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',

  STUDENTS_VIEW: 'students.view',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_EDIT: 'students.edit',
  STUDENTS_DELETE: 'students.delete',

  PARENTS_VIEW: 'parents.view',
  PARENTS_CREATE: 'parents.create',
  PARENTS_EDIT: 'parents.edit',

  STAFF_VIEW: 'staff.view',
  STAFF_CREATE: 'staff.create',
  STAFF_EDIT: 'staff.edit',

  CONTENT_VIEW: 'content.view',
  CONTENT_CREATE: 'content.create',
  CONTENT_EDIT: 'content.edit',
  CONTENT_DELETE: 'content.delete',
  CONTENT_PUBLISH: 'content.publish',

  EXAMS_VIEW: 'exams.view',
  EXAMS_CREATE: 'exams.create',
  EXAMS_EDIT: 'exams.edit',
  EXAMS_DELETE: 'exams.delete',
  EXAMS_PUBLISH: 'exams.publish',

  RESULTS_VIEW: 'results.view',
  RESULTS_CREATE: 'results.create',
  RESULTS_EDIT: 'results.edit',
  RESULTS_APPROVE: 'results.approve',
  RESULTS_PUBLISH: 'results.publish',

  FEES_VIEW: 'fees.view',
  FEES_MANAGE: 'fees.manage',

  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_MANAGE: 'attendance.manage',

  REPORTS_VIEW: 'reports.view',
  SETTINGS_MANAGE: 'settings.manage',
  AUDIT_VIEW: 'audit.view',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL: PermissionKey[] = Object.values(PERMISSIONS);

export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: ALL,

  admin: ALL.filter((permission) => permission !== PERMISSIONS.USERS_DELETE),

  principal: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.PARENTS_VIEW,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.EXAMS_VIEW,
    PERMISSIONS.EXAMS_CREATE,
    PERMISSIONS.EXAMS_EDIT,
    PERMISSIONS.EXAMS_PUBLISH,
    PERMISSIONS.RESULTS_VIEW,
    PERMISSIONS.RESULTS_APPROVE,
    PERMISSIONS.RESULTS_PUBLISH,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],

  vice_principal: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.PARENTS_VIEW,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.EXAMS_VIEW,
    PERMISSIONS.EXAMS_CREATE,
    PERMISSIONS.EXAMS_EDIT,
    PERMISSIONS.RESULTS_VIEW,
    PERMISSIONS.RESULTS_APPROVE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],

  hod: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.EXAMS_VIEW,
    PERMISSIONS.EXAMS_CREATE,
    PERMISSIONS.EXAMS_EDIT,
    PERMISSIONS.RESULTS_VIEW,
    PERMISSIONS.RESULTS_CREATE,
    PERMISSIONS.RESULTS_EDIT,
    PERMISSIONS.RESULTS_APPROVE,
    PERMISSIONS.ATTENDANCE_VIEW,
  ],

  teacher: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.EXAMS_VIEW,
    PERMISSIONS.EXAMS_CREATE,
    PERMISSIONS.RESULTS_VIEW,
    PERMISSIONS.RESULTS_CREATE,
    PERMISSIONS.RESULTS_EDIT,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MANAGE,
  ],

  accountant: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.PARENTS_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
  ],

  parent: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.RESULTS_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
  ],

  student: [PERMISSIONS.RESULTS_VIEW, PERMISSIONS.ATTENDANCE_VIEW, PERMISSIONS.CONTENT_VIEW],

  alumni: [PERMISSIONS.CONTENT_VIEW],
};

export function permissionsForRole(role: UserRole | null | undefined): PermissionKey[] {
  return role ? ROLE_PERMISSIONS[role] ?? [] : [];
}

export function hasPermission(role: UserRole | null | undefined, permission: string): boolean {
  return permissionsForRole(role).includes(permission as PermissionKey);
}
