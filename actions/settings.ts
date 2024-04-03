'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { getUserByEmail, getUserById } from '@/data/user';

import { SettingsSchema } from '@/schemas';

import { currentUser } from '@/lib/auth';
import db from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id!);
  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  if (user.isOAuth) {
    invalidateFieldForOAuthUser(values);
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use' };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });
    return { success: 'Verification email sent' };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordMatch) {
      return { error: 'Incorrect password' };
    }

    values.password = await bcrypt.hash(values.newPassword, 10);
    values.newPassword = undefined;
  }

  await db.user.update({ where: { id: dbUser.id }, data: { ...values } });

  return { success: 'Settings updated' };
};

const invalidateFieldForOAuthUser = (
  values: z.infer<typeof SettingsSchema>
) => {
  values.email = undefined;
  values.password = undefined;
  values.newPassword = undefined;
  values.isTwoFactorEnabled = undefined;
};
