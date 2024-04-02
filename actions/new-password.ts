'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';

import { NewPasswordSchema } from '@/schemas';

import { getCurrentDateWithDst } from '@/lib/date';
import db from '@/lib/db';

export const newPassword = async ({
  values,
  token,
}: {
  token: string;
  values: z.infer<typeof NewPasswordSchema>;
}) => {
  if (!token) {
    return { error: 'Missing token' };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid password' };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken({ token });
  if (!existingToken) {
    return { error: 'Invalid token' };
  }

  const hasExpired = existingToken.expires < getCurrentDateWithDst();
  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: 'Email does not exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });
  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: 'Password reset' };
};
