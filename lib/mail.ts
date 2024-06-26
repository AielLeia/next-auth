import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a two-factor authentication token email to the specified email address.
 *
 * @param email - The email address to send the token to.
 * @param token - The two-factor authentication token.
 */
export const sendTwoFactorTokenEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA Code',
    html: `
     <p>Your 2FA Code: ${token}</p>
    `,
  });
};

/**
 * Sends a password reset email to the specified email address.
 *
 * @param email - The email address to send the password reset email to.
 * @param token - The token used for password reset.
 */
export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `
     <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    `,
  });
};

/**
 * Sends a verification email to the specified email address.
 *
 * @param email - The email address to send the verification email to.
 * @param token - The verification token to include in the email.
 */
export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    html: `
     <p>Click <a href="${confirmLink}">here</a> to confirm email.</p>
    `,
  });
};
