import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password with bcrypt.
 *
 * @returns the bcrypt hash (never the plain text).
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored bcrypt hash.
 */
export async function comparePassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

