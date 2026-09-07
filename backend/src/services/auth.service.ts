import { ApiError } from '../utils/api-error.js';
import { comparePassword } from '../utils/password.js';
import {
  jwtExpiresInSeconds,
  signAccessToken,
} from '../utils/jwt.js';
import {
  findByEmailWithRole,
  findByIdWithRole,
  updateLastLogin,
} from '../repositories/user.repository.js';
import type {
  AuthUser,
  LoginData,
  UserWithRole,
} from '../types/user.types.js';

interface LoginInput {
  email: string;
  password: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Map a DB user (with role) to the public AuthUser shape. Never exposes the
 * password hash.
 */
function toAuthUser(user: UserWithRole): AuthUser {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    avatar: user.avatar,
    role: user.role_slug,
  };
}

/**
 * Authenticate a user by email + password.
 *
 * Checks, in order:
 *  1. the email exists,
 *  2. the account is active,
 *  3. the password matches the stored hash.
 *
 * On success it signs a JWT, updates `last_login` and returns the token plus
 * the public user. The same generic error is returned for unknown email and
 * wrong password to avoid leaking which emails exist.
 */
export async function login(input: LoginInput): Promise<LoginData> {
  const normalizedEmail = normalizeEmail(input.email);
  const user = await findByEmailWithRole(normalizedEmail);

  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  if (!user.is_active) {
    throw ApiError.unauthorized('Account is disabled');
  }

  const passwordMatches = await comparePassword(
    input.password,
    user.password_hash,
  );

  if (!passwordMatches) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const authUser = toAuthUser(user);
  const token = signAccessToken({
    userId: user.id,
    role: user.role_slug,
    email: user.email,
  });

  // Fire-and-forget: tracking last_login must not fail the login request.
  updateLastLogin(user.id).catch(() => undefined);

  return {
    user: authUser,
    token,
    expiresIn: jwtExpiresInSeconds(),
  };
}

/**
 * Return the public profile of the currently authenticated user.
 */
export async function getCurrentUser(userId: number): Promise<AuthUser> {
  const user = await findByIdWithRole(userId);

  if (!user) {
    throw ApiError.unauthorized('User not found');
  }

  if (!user.is_active) {
    throw ApiError.unauthorized('Account is disabled');
  }

  return toAuthUser(user);
}

/**
 * Logout is stateless: the client discards the token. We simply acknowledge
 * the operation.
 */
export async function logout(): Promise<{ message: string }> {
  return { message: 'Logged out successfully' };
}
