import bcrypt from 'bcryptjs';

export type UserType =
  | 'Super Admin'
  | 'Administrator'
  | 'Principal'
  | 'Vice Principal'
  | 'HOD'
  | 'Teacher'
  | 'Accountant'
  | 'Parent'
  | 'Student'
  | 'Alumni';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  photo?: string;
  avatarUrl?: string;
  role: UserType;
  isActive: boolean;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  /** Used by forgot/reset password flows */
  resetToken?: string;
  resetTokenExpiry?: string;
  twoFactorEnabled?: boolean;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    announcements: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: UserType;
  description: string;
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// Pre-hashed default password for pre-seeded accounts: "Jasmine2025!" or "Password123!"
const defaultHashedPassword = bcrypt.hashSync("Jasmine2025!", 10);
const demoHashedPassword = bcrypt.hashSync("Password123!", 10);

export const usersStore: User[] = [
  {
    id: "usr_super_admin",
    name: "System Super Admin",
    email: "superadmin@jasmineexclusiveschool.com",
    passwordHash: defaultHashedPassword,
    phone: "+234 806 078 2404",
    role: "Super Admin",
    isActive: true,
    isEmailVerified: true,
    twoFactorEnabled: false,
    notificationPreferences: { email: true, sms: true, announcements: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "usr_principal",
    name: "Dr. (Mrs.) E. O. Aigbe",
    email: "principal@jasmineexclusiveschool.com",
    passwordHash: defaultHashedPassword,
    phone: "+234 806 078 2404",
    role: "Principal",
    isActive: true,
    isEmailVerified: true,
    twoFactorEnabled: false,
    notificationPreferences: { email: true, sms: true, announcements: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "usr_teacher",
    name: "Mrs. Grace Osagie",
    email: "grace.osagie@jasmineexclusiveschool.com",
    passwordHash: defaultHashedPassword,
    phone: "+234 801 234 5678",
    role: "Teacher",
    isActive: true,
    isEmailVerified: true,
    twoFactorEnabled: false,
    notificationPreferences: { email: true, sms: false, announcements: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "usr_parent",
    name: "Mr. & Mrs. Clinton",
    email: "parent@example.com",
    passwordHash: defaultHashedPassword,
    phone: "+234 802 345 6789",
    role: "Parent",
    isActive: true,
    isEmailVerified: true,
    twoFactorEnabled: false,
    notificationPreferences: { email: true, sms: true, announcements: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "usr_student",
    name: "Osasere Clinton",
    email: "student@example.com",
    passwordHash: defaultHashedPassword,
    phone: "+234 803 456 7890",
    role: "Student",
    isActive: true,
    isEmailVerified: true,
    twoFactorEnabled: false,
    notificationPreferences: { email: true, sms: false, announcements: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "usr_student_demo",
    name: "Osasere Clinton",
    email: "student@jasmine.edu.ng",
    passwordHash: demoHashedPassword,
    phone: "+234 803 456 7890",
    role: "Student",
    isActive: true,
    isEmailVerified: true,
    twoFactorEnabled: false,
    notificationPreferences: { email: true, sms: false, announcements: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sessionsStore: Session[] = [];
