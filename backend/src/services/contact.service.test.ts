import test from 'node:test';
import assert from 'node:assert/strict';
import { toPublicContact } from './contact.service.js';
import type { ContactWithRelations } from '../types/contact.types.js';

function makeContact(overrides: Partial<ContactWithRelations> = {}): ContactWithRelations {
  return {
    id: 1,
    company_id: 2,
    company_name: 'TechNova SAS',
    first_name: 'Ahmed',
    last_name: 'Benali',
    email: 'ahmed.benali@technova.fr',
    phone: '+33 6 12 34 56 78',
    position: 'Directeur Commercial',
    owner_id: 3,
    owner_first_name: 'Sarah',
    owner_last_name: 'Léger',
    owner_email: 'sarah.leger@leadpro.com',
    owner_avatar: null,
    notes: 'Client stratégique',
    created_at: new Date('2025-01-13T09:00:00Z'),
    updated_at: new Date('2025-01-13T09:00:00Z'),
    deleted_at: null,
    ...overrides,
  };
}

test('toPublicContact maps all fields correctly', () => {
  const contact = makeContact();
  const result = toPublicContact(contact);

  assert.equal(result.id, 1);
  assert.equal(result.firstName, 'Ahmed');
  assert.equal(result.lastName, 'Benali');
  assert.equal(result.email, 'ahmed.benali@technova.fr');
  assert.equal(result.phone, '+33 6 12 34 56 78');
  assert.equal(result.position, 'Directeur Commercial');
  assert.equal(result.notes, 'Client stratégique');
  assert.equal(result.createdAt, contact.created_at);
  assert.equal(result.updatedAt, contact.updated_at);
});

test('toPublicContact maps the company to a nested object', () => {
  const result = toPublicContact(makeContact());

  assert.deepEqual(result.company, {
    id: 2,
    name: 'TechNova SAS',
  });
});

test('toPublicContact maps the owner to a nested object', () => {
  const result = toPublicContact(makeContact());

  assert.deepEqual(result.owner, {
    id: 3,
    firstName: 'Sarah',
    lastName: 'Léger',
    email: 'sarah.leger@leadpro.com',
    avatar: null,
  });
});

test('toPublicContact never exposes internal ids or joined columns', () => {
  const result = toPublicContact(makeContact());
  assert.ok(!('company_id' in result));
  assert.ok(!('company_name' in result));
  assert.ok(!('owner_id' in result));
  assert.ok(!('owner_first_name' in result));
  assert.ok(!('owner_last_name' in result));
});

test('toPublicContact handles null optional fields', () => {
  const result = toPublicContact(
    makeContact({
      email: null,
      phone: null,
      position: null,
      notes: null,
    }),
  );

  assert.equal(result.email, null);
  assert.equal(result.phone, null);
  assert.equal(result.position, null);
  assert.equal(result.notes, null);
});

