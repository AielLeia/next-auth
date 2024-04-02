'use server';

import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByEmail } from '@/data/verification-token';

import { LoginSchema } from '@/schemas';

import { getCurrentDateWithDst } from '@/lib/date';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password } = validatedFields.data;

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
      existingVerificationToken &&
      existingVerificationToken.expires &&
      existingVerificationToken.expires <= currentDate;

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
