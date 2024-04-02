import db from '@/lib/db';

export const getTwoFactorConfirmationByUserId = async ({
  userId,
}: {
  userId: string;
}) => {
  try {
    return await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
  } catch (err) {
    return null;
  }
};
