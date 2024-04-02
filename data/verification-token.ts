import db from '@/lib/db';

/**
 * Retrieves a verification token by its token value.
 *
 * @param {string} token - The token value to search for.
 */
export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db.verificationToken.findUnique({
      where: { token },
    });
  } catch (err) {
    return null;
  }
};

/**
 * Retrieves the verification token associated with the given email.
 *
 * @param email - The email address to search for.
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.verificationToken.findFirst({
      where: { email },
    });
  } catch (err) {
    return null;
  }
};
