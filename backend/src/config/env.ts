import 'dotenv/config';

/**
 * Centralized environment configuration.
 *
 * All environment variables are read once here and exposed through a typed
 * object. The rest of the application should import from this module instead
 * of accessing `process.env` directly.
 */

function parsePort(value: string | undefined): number {
  const port = Number(value ?? 5000);
  return Number.isInteger(port) && port > 0 ? port : 5000;
}

function parseNodeEnv(
  value: string | undefined,
): 'development' | 'production' | 'test' {
  if (value === 'production' || value === 'test') {
    return value;
  }
  return 'development';
}

function parseDbPort(value: string | undefined): number {
  const port = Number(value ?? 3306);
  return Number.isInteger(port) && port > 0 ? port : 3306;
}

function parseJwtExpiresIn(value: string | undefined): string {
  return value && /^\d+[smhd]$/.test(value) ? value : '1d';
}

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);
export const isProduction = nodeEnv === 'production';

const jwtSecret = process.env.JWT_SECRET ?? '';

if (!jwtSecret && isProduction) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',

  // --- Database (MySQL) -----------------------------------------------------
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbPort: parseDbPort(process.env.DB_PORT),
  dbUser: process.env.DB_USER ?? 'root',
  dbPassword: process.env.DB_PASSWORD ?? '',
  dbName: process.env.DB_NAME ?? 'leadpro_crm',

  // --- JWT ------------------------------------------------------------------
  jwtSecret: jwtSecret || 'leadpro-dev-secret-change-me',
  jwtExpiresIn: parseJwtExpiresIn(process.env.JWT_EXPIRES_IN),
} as const;
