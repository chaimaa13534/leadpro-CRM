import path from 'node:path';

/**
 * Runtime files must live outside `backend/`: `tsx watch` restarts the
 * development server when a file changes beneath that directory, which would
 * otherwise interrupt an avatar upload before its HTTP response is sent.
 */
export const uploadsDirectory = path.resolve(
  process.cwd(),
  '..',
  '.leadpro-runtime',
  'uploads',
);

export const avatarDirectory = path.join(uploadsDirectory, 'avatars');
