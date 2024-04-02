'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';

import { getCurrentDateWithDst } from '@/lib/date';
import db from '@/lib/db';

export const newVerification = async ({ token }: { token: string }) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error: 'Token does not exists',
    };
  }

  const hasExpired = existingToken.expires < getCurrentDateWithDst();
  if (hasExpired) {
    return {
      error: 'Token has expired',
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: 'Email does not exists',
    };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: getCurrentDateWithDst(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });
  return { success: 'Email verified' };
};
