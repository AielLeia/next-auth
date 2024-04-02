import db from '@/lib/db';

/**
 * Retrieves a password reset token by its token value.
 *
 * @param {string} token - The token value of the password reset token.
 */
export const getPasswordResetTokenByToken = async ({
  token,
}: {
  token: string;
}) => {
  try {
    return await db.passwordResetToken.findUnique({ where: { token } });
  } catch (err) {
    return null;
  }
};

/**
 * Retrieves the password reset token for a given email.
 *
 * @param {string} email - The email address to search for.
 */
export const getPasswordResetTokenByEmail = async ({
  email,
}: {
  email: string;
}) => {
  try {
    return await db.passwordResetToken.findFirst({ where: { email } });
  } catch (err) {
    return null;
  }
};
