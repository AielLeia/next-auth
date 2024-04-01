'use server';

import { getUserByEmail } from '@/data/user';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { RegisterSchema } from '@/schemas';

import db from '@/lib/db';

/**
 * Registers a new user with the provided information.
 *
 * @param values - The user information to register.
 * @returns An object indicating the success or failure of the registration.
 *          If successful, the object will contain a 'success' property.
 *          If unsuccessful, the object will contain an 'error' property with the corresponding error message.
 */
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already taken' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: Send verification token email

  return { success: 'User created' };
};
