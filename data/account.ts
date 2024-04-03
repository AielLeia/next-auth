import db from '@/lib/db';

/**
 * Retrieves the account associated with the given user ID.
 *
 * @param {string} userId - The ID of the user.
 */
export const getAccountByUserId = async ({ userId }: { userId: string }) => {
  try {
    return await db.account.findFirst({ where: { userId } });
  } catch (err) {
    return null;
  }
};
