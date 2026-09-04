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
  role: UserType;
  isActive: boolean;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
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

// In-Memory Database Store with pre-hashed default admin and mock accounts
// Note: Default password for pre-seeded users is "Jasmine2025!"
const defaultHashedPassword =
  "$2a$10$wS2Wb5.iR9M.4ZfK8zU9/e5p3X.kEaB1u7K8p/ZzKzYpL/W3S4o5m"; // Hash for Jasmine2025!

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
    notificationPreferences: { email: true, sms: false, announcements: true },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sessionsStore: Session[] = [];
