import db from '@/lib/db';

/**
 * Retrieves a two-factor token by its token value.
 *
 * @param {string} token - The token value of the two-factor token.
 */
export const getTwoFactorTokenByToken = async ({
  token,
}: {
  token: string;
}) => {
  try {
    return await db.twoFactorToken.findUnique({ where: { token } });
  } catch (err) {
    return null;
  }
};

/**
 * Retrieves the two-factor authentication token for a given email.
 *
 * @param {string} email - The email address to retrieve the token for.
 */
export const getTwoFactorTokenByEmail = async ({
  email,
}: {
  email: string;
}) => {
  try {
    return await db.twoFactorToken.findFirst({ where: { email } });
  } catch (err) {
    return null;
  }
};
