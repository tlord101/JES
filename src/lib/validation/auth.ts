import { z } from 'zod';

/** Password policy enforced for every account created in the app. */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.');

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Email address is required.')
  .email('Enter a valid email address.');

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
  portal: z.enum(['admin', 'staff', 'parent', 'student']).optional(),
  redirect: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Enter the full name.'),
    email: emailSchema,
    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number.')
      .max(20, 'Enter a valid phone number.'),
    role: z.enum(['parent', 'student', 'alumni']).default('parent'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(3, 'Enter the full name.'),
  phone: z.string().trim().max(20, 'Enter a valid phone number.').optional().or(z.literal('')),
  avatarUrl: z.string().trim().url('Enter a valid image URL.').optional().or(z.literal('')),
});

/** Collects field level errors from a ZodError into a plain object. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form';
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
