import crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getVerificationTokenByEmail } from '@/data/verification-token';

import { getCurrentTimeWithOneHour } from '@/lib/date';
import db from '@/lib/db';

/**
 * Generates a verification token for the given email.
 *
 * @param email - The email address to generate the token for.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = getCurrentTimeWithOneHour();

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  }

  return db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

/**
 * Generates a password reset token for a given email.
 *
 * @param {string} email - The email address to generate the token for.
 */
export const generatePasswordResetToken = async ({
  email,
}: {
  email: string;
}) => {
  const token = uuidv4();
  const expires = getCurrentTimeWithOneHour();

  const existingToken = await getPasswordResetTokenByEmail({ email });
  if (existingToken) {
    await db.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  return db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

/**
 * Generates a two-factor authentication token for a given email.
 *
 * @param {string} email - The email address to generate the token for.
 */
export const generateTwoFactorToken = async ({ email }: { email: string }) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = getCurrentTimeWithOneHour();

  const existingTwoFactorToken = await getTwoFactorTokenByEmail({ email });
  if (existingTwoFactorToken) {
    await db.twoFactorToken.delete({
      where: { id: existingTwoFactorToken.id },
    });
  }

  return db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};
