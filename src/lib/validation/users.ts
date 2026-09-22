import { z } from 'zod';
import { emailSchema, passwordSchema } from './auth';

export const USER_ROLES = [
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
] as const;

/**
 * Administrator-created account. The role decides which linked record is
 * created alongside the profile:
 *   student  -> students row (admission number, class, guardian link)
 *   staff    -> staff row (staff number, position, department)
 *   parent   -> parents row (occupation, address)
 */
export const createUserSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Enter the full name.'),
    email: emailSchema,
    phone: z.string().trim().min(7, 'Enter a valid phone number.').max(20),
    role: z.enum(USER_ROLES),
    password: passwordSchema,

    // Student specific
    gender: z.enum(['male', 'female']).optional(),
    dateOfBirth: z.string().trim().optional(),
    classId: z.string().uuid('Choose a class.').optional().or(z.literal('')),
    admissionNo: z.string().trim().max(40).optional().or(z.literal('')),

    // Staff specific
    position: z.string().trim().max(80).optional().or(z.literal('')),
    department: z.string().trim().max(80).optional().or(z.literal('')),
    staffNo: z.string().trim().max(40).optional().or(z.literal('')),

    // Parent specific
    occupation: z.string().trim().max(80).optional().or(z.literal('')),
    relationship: z.string().trim().max(40).optional().or(z.literal('')),
    address: z.string().trim().max(200).optional().or(z.literal('')),
  })
  .superRefine((value, ctx) => {
    if (value.role === 'student') {
      if (!value.gender) {
        ctx.addIssue({ code: 'custom', path: ['gender'], message: 'Select the student gender.' });
      }
      if (!value.classId) {
        ctx.addIssue({ code: 'custom', path: ['classId'], message: 'Assign the student to a class.' });
      }
    }
    if (value.role === 'teacher' || value.role === 'hod') {
      if (!value.position) {
        ctx.addIssue({ code: 'custom', path: ['position'], message: 'Enter the staff position.' });
      }
    }
  });

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(3, 'Enter the full name.'),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  role: z.enum(USER_ROLES),
  isActive: z.enum(['true', 'false']),
  isVerified: z.enum(['true', 'false']),
});

export const linkChildSchema = z.object({
  parentId: z.string().uuid('Choose a parent.'),
  studentId: z.string().uuid('Choose a student.'),
  relationship: z.string().trim().min(3).max(40).default('guardian'),
  isPrimary: z.enum(['true', 'false']).default('false'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
