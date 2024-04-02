'use server';

import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByEmail } from '@/data/verification-token';

import { LoginSchema } from '@/schemas';

import { getCurrentDateWithDst } from '@/lib/date';
import db from '@/lib/db';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/token';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Invalid credentials' };
  }

  if (!existingUser.emailVerified) {
    const existingVerificationToken = await getVerificationTokenByEmail(
      existingUser.email
    );
    const currentDate = getCurrentDateWithDst();
    const isVerificationTokenInvalid =
      !existingVerificationToken ||
      !existingVerificationToken.expires ||
      existingVerificationToken.expires > currentDate;

    if (isVerificationTokenInvalid) {
      const verificationToken = await generateVerificationToken(email);

      await sendVerificationEmail({
        email: verificationToken.email,
        token: verificationToken.token,
      });

      return {
        success: 'A new confirmation email sent',
      };
    }

    return {
      error: 'Email verification has been sent and not validated yet',
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail({
        email: existingUser.email,
      });
      if (!twoFactorToken) {
        return { error: 'Invalid code' };
      }

      if (twoFactorToken.token !== code) {
        return { error: 'Invalid code' };
      }

      const hasExpired = twoFactorToken.expires < getCurrentDateWithDst();
      if (hasExpired) {
        return { error: 'Code expired' };
      }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      const existingConfirmation = await getTwoFactorConfirmationByUserId({
        userId: existingUser.id,
      });
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken({
        email: existingUser.email,
      });
      await sendTwoFactorTokenEmail({
        email: twoFactorToken.email,
        token: twoFactorToken.token,
      });

      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }

    throw err;
  }
};
