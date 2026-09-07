import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { uploadsDirectory } from './config/uploads.js';
import routes from './routes/index.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

/**
 * Express application configuration.
 *
 * This module is responsible for building and configuring the Express app.
 * The server bootstrap (listening on a port) lives in server.ts.
 */
const app = express();

// --- Security headers -------------------------------------------------------
app.use(helmet());

// --- CORS -------------------------------------------------------------------
// Only the configured frontend origin is allowed in development. This is
// intentionally restrictive and must be adjusted for production.
const allowedOrigins = [env.frontendUrl];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin (e.g. curl, server-to-server).
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

// --- Body parsing -----------------------------------------------------------
// Avatar uploads are optimized in the browser before Base64 encoding.
// The tight limit prevents the proxy from accepting multi-megabyte payloads.
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use('/api/uploads', express.static(uploadsDirectory));

// --- API routes -------------------------------------------------------------
app.use('/api', routes);

// --- 404 handler ------------------------------------------------------------
app.use(notFoundMiddleware);

// --- Global error handler ---------------------------------------------------
app.use(errorMiddleware);

export default app;
