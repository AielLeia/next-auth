import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine((data) => !(data.password && !data.newPassword), {
    message: 'New password is required',
    path: ['newPassword'],
  })
  .refine((data) => !(data.newPassword && !data.password), {
    message: 'Password is required',
    path: ['password'],
  });

export const LoginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Minimum 6 characters required' }),
});

export const RegisterSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(6, { message: 'Minimum 6 characters required' }),
  name: z.string().min(1, { message: 'Name is required' }),
});
