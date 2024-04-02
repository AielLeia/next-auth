import { v4 as uuidv4 } from 'uuid';

import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
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
