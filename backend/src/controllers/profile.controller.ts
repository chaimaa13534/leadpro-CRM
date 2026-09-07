import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import * as profileService from '../services/profile.service.js';

function userId(req: Request): number { if (!req.user) throw new Error('Authenticated user is missing'); return req.user.id; }
export const getProfile = asyncHandler(async (req, res: Response) => res.json({ success: true, data: await profileService.getProfile(userId(req)) }));
export const patchProfile = asyncHandler(async (req, res: Response) => res.json({ success: true, data: await profileService.updateProfile(userId(req), req.body) }));
export const postAvatar = asyncHandler(async (req, res: Response) => res.json({ success: true, data: await profileService.updateAvatar(userId(req), req.body.image) }));
export const deleteProfile = asyncHandler(async (req, res: Response) => { await profileService.deleteProfile(userId(req)); res.json({ success: true, data: { message: 'Account deleted successfully' } }); });
