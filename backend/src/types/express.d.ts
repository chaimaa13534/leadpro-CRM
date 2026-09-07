import type { AuthUser } from './user.types.js';

/**
 * Express Request augmentation.
 *
 * After the `requireAuth` middleware has run, `req.user` is populated with
 * the authenticated user. On unprotected routes it stays `undefined`.
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};

