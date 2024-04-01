/**
 * Represents an array of public routes that are accessible for unauthenticated users.
 *
 * @constant publicRoutes
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/'];

/**
 * Represents an array of routes that are used for authenticating users.
 * These routes will redirect logged-in users to /settings.
 *
 * @constant authRoutes
 * @type {string[]}
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
];

/**
 * Defines the prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 *
 * @constant apiAuthPrefix
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * The default redirect path after logging in.
 *
 * @constant DEFAULT_LOGIN_REDIRECT
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/settings';
