import test from 'node:test';
import assert from 'node:assert/strict';
import { toPublicUser } from './user.service.js';
import type { UserWithRole } from '../types/user.types.js';

function makeUser(overrides: Partial<UserWithRole> = {}): UserWithRole {
  return {
    id: 1,
    first_name: 'Sarah',
    last_name: 'Léger',
    email: 'sarah.leger@leadpro.com',
    password_hash: '$2b$10$somehash',
    avatar: null,
    phone: '+33 6 12 34 56 78',
    role_id: 1,
    role_name: 'Admin',
    role_slug: 'admin',
    is_active: true,
    last_login: null,
    created_at: new Date('2025-01-10T08:00:00Z'),
    updated_at: new Date('2025-01-20T09:15:00Z'),
    deleted_at: null,
    ...overrides,
  };
}

test('toPublicUser maps all fields correctly', () => {
  const user = makeUser();
  const result = toPublicUser(user);

  assert.equal(result.id, 1);
  assert.equal(result.firstName, 'Sarah');
  assert.equal(result.lastName, 'Léger');
  assert.equal(result.email, 'sarah.leger@leadpro.com');
  assert.equal(result.phone, '+33 6 12 34 56 78');
  assert.equal(result.avatar, null);
  assert.equal(result.role, 'admin');
  assert.equal(result.roleName, 'Admin');
  assert.equal(result.isActive, true);
  assert.equal(result.createdAt, user.created_at);
  assert.equal(result.updatedAt, user.updated_at);
});

test('toPublicUser never exposes the password hash', () => {
  const result = toPublicUser(makeUser());
  assert.ok(!('password_hash' in result));
  assert.ok(!('passwordHash' in result));
});

test('toPublicUser maps inactive users to isActive = false', () => {
  const result = toPublicUser(makeUser({ is_active: false }));
  assert.equal(result.isActive, false);
});

test('toPublicUser handles null phone and avatar', () => {
  const result = toPublicUser(makeUser({ phone: null, avatar: null }));
  assert.equal(result.phone, null);
  assert.equal(result.avatar, null);
});
