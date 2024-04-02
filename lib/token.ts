import { v4 as uuidv4 } from 'uuid';

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
