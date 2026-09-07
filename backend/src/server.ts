import app from './app.js';
import { env } from './config/env.js';

/**
 * Server bootstrap.
 *
 * This module is responsible for starting the HTTP server. It is kept
 * separate from app.ts so the Express app can be imported and tested in
 * isolation without opening a port.
 */
const server = app.listen(env.port, () => {
  console.log(`LeadPro CRM API running on http://localhost:${env.port}`);
});

// Graceful shutdown on SIGINT / SIGTERM.
const shutdown = (signal: string): void => {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Force-exit if close takes too long.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

