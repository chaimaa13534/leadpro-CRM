import mysql from 'mysql2/promise';
import { env } from './env.js';

/**
 * MySQL connection pool.
 *
 * Uses mysql2/promise so every query returns native Promises. The pool is
 * created lazily — no connection is opened until the first query is executed.
 */
export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  timezone: 'Z',
  decimalNumbers: true,
  dateStrings: false,
});

/**
 * Simple connectivity check used by health endpoints.
 */
export async function pingDatabase(): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

