import db from '@/lib/db';

/**
 * Retrieves a user from the database based on their email address.
 *
 * @param email - The email address of the user to retrieve.
 * @returns A Promise that resolves to the user object if found, or null if not found.
 */
export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (err) {
    return null;
  }
};

/**
 * Retrieves a user from the database by their ID.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @returns A promise that resolves to the user object if found, or null if not found.
 */
export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({ where: { id } });
  } catch (err) {
    return null;
  }
};
