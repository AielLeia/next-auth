import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUserByEmail } from '@/data/user';

import { LoginSchema } from '@/schemas';

export default {
  providers: [
    Credentials({
      async authorize(credential) {
        const validatedFields = LoginSchema.safeParse(credential);

        if (validatedFields.success) {
          const { password, email } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
