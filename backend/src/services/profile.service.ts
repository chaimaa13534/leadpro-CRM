import { ApiError } from '../utils/api-error.js';
import { findByEmailWithRole, findByIdWithRole, softDeleteUser, updateUser } from '../repositories/user.repository.js';
import { toPublicUser } from './user.service.js';
import type { PublicUser } from '../types/user.types.js';

const maxAvatarBytes = 1024 * 1024;
const avatarExtensions = new Map([
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
  ['image/bmp', 'bmp'],
  ['image/svg+xml', 'svg'],
]);
export type ProfileInput = { firstName?: string; lastName?: string; email?: string; phone?: string };

export async function getProfile(userId: number): Promise<PublicUser> {
  const user = await findByIdWithRole(userId);
  if (!user) throw ApiError.unauthorized('User not found');
  return toPublicUser(user);
}

export async function updateProfile(userId: number, input: ProfileInput): Promise<PublicUser> {
  const current = await findByIdWithRole(userId);
  if (!current) throw ApiError.unauthorized('User not found');
  if (input.email && input.email.toLowerCase() !== current.email.toLowerCase()) {
    const existing = await findByEmailWithRole(input.email);
    if (existing && existing.id !== userId) throw ApiError.conflict('An account already uses this email address');
    const { pool } = await import('../config/database.js');
    await pool.execute('UPDATE users SET email = ? WHERE id = ? AND deleted_at IS NULL', [input.email.trim().toLowerCase(), userId]);
  }
  await updateUser(userId, { firstName: input.firstName, lastName: input.lastName, phone: input.phone });
  return getProfile(userId);
}

export async function updateAvatar(userId: number, image: string): Promise<PublicUser> {
  const match = /^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/.exec(image);
  if (!match) throw ApiError.badRequest('The selected file is not a valid image');
  const mimeType = match[1].toLowerCase();
  const extension = avatarExtensions.get(mimeType);
  const buffer = Buffer.from(match[2], 'base64');
  if (!extension) throw ApiError.badRequest('This image format is not supported');
  if (buffer.length === 0 || buffer.length > maxAvatarBytes) throw ApiError.badRequest('The image must be smaller than 10 MB');
  if (!(await findByIdWithRole(userId))) throw ApiError.unauthorized('User not found');

  // L'avatar est conserv? directement dans la table users. La data URL reste
  // imm?diatement exploitable par les balises <img> sans d?pendre du disque.
  await updateUser(userId, { avatar: `data:${mimeType};base64,${match[2]}` });
  return getProfile(userId);
}

export async function deleteProfile(userId: number): Promise<void> {
  if (!(await findByIdWithRole(userId))) throw ApiError.unauthorized('User not found');
  await softDeleteUser(userId);
}
