import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtClaims, JwtPayload } from '../types/user.types.js';
import { ApiError } from './api-error.js';

/**
 * Sign an access token containing only the useful claims:
 * userId, role and email. Expiration comes from the .env config.
 */
export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

/**
 * Verify a token and return its claims. Throws a 401 ApiError when the
 * token is malformed, tampered with or expired.
 */
export function verifyAccessToken(token: string): JwtClaims {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    return decoded as unknown as JwtClaims;
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }
}

/**
 * Parse the `Authorization` header and return the Bearer token, or null
 * when the header is missing or does not follow the `Bearer <token>` format.
 */
export function extractBearerToken(header: string | undefined): string | null {
  if (!header) {
    return null;
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return null;
  }

  return parts[1];
}

/**
 * Convert the configured JWT expiration (e.g. "1d", "2h", "30m") into
 * seconds so the API can advertise it to clients.
 */
export function jwtExpiresInSeconds(): number {
  const match = /^(\d+)([smhd])$/.exec(env.jwtExpiresIn);
  if (!match) {
    return 24 * 60 * 60;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  return amount * (multipliers[unit] ?? 1);
}

