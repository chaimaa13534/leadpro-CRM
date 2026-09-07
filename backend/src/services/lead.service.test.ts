import test from 'node:test';
import assert from 'node:assert/strict';
import { toPublicLead } from './lead.service.js';
import type { LeadWithRelations } from '../types/lead.types.js';

function makeLead(overrides: Partial<LeadWithRelations> = {}): LeadWithRelations {
  return {
    id: 1,
    company_id: 2,
    company_name: 'TechNova SAS',
    contact_id: 3,
    contact_first_name: 'Alice',
    contact_last_name: 'Martin',
    contact_email: 'alice.martin@technova.fr',
    contact_phone: '+33 1 40 00 00 11',
    owner_id: 4,
    owner_first_name: 'Sarah',
    owner_last_name: 'Léger',
    owner_email: 'sarah.leger@leadpro.com',
    owner_avatar: null,
    source_id: 1,
    source_name: 'Website',
    status: 'qualified',
    priority: 'high',
    estimated_value: 25000,
    notes: 'Projet identifié',
    created_at: new Date('2025-01-13T09:00:00Z'),
    updated_at: new Date('2025-01-16T10:00:00Z'),
    deleted_at: null,
    ...overrides,
  };
}

test('toPublicLead maps all core fields correctly', () => {
  const lead = makeLead();
  const result = toPublicLead(lead);

  assert.equal(result.id, 1);
  assert.equal(result.status, 'qualified');
  assert.equal(result.priority, 'high');
  assert.equal(result.estimatedValue, 25000);
  assert.equal(result.notes, 'Projet identifié');
  assert.equal(result.createdAt, lead.created_at);
  assert.equal(result.updatedAt, lead.updated_at);
});

test('toPublicLead maps company to a nested object', () => {
  const result = toPublicLead(makeLead());
  assert.deepEqual(result.company, { id: 2, name: 'TechNova SAS' });
});

test('toPublicLead maps contact to a nested object', () => {
  const result = toPublicLead(makeLead());
  assert.deepEqual(result.contact, {
    id: 3,
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice.martin@technova.fr',
    phone: '+33 1 40 00 00 11',
  });
});

test('toPublicLead maps owner to a nested object', () => {
  const result = toPublicLead(makeLead());
  assert.deepEqual(result.owner, {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Léger',
    email: 'sarah.leger@leadpro.com',
    avatar: null,
  });
});

test('toPublicLead maps source to a nested object', () => {
  const result = toPublicLead(makeLead());
  assert.deepEqual(result.source, { id: 1, name: 'Website' });
});

test('toPublicLead never exposes internal ids or joined columns', () => {
  const result = toPublicLead(makeLead());
  assert.ok(!('company_id' in result));
  assert.ok(!('company_name' in result));
  assert.ok(!('contact_id' in result));
  assert.ok(!('owner_id' in result));
  assert.ok(!('source_id' in result));
  assert.ok(!('owner_first_name' in result));
});

test('toPublicLead handles null relations', () => {
  const result = toPublicLead(
    makeLead({
      company_id: null,
      company_name: null,
      contact_id: null,
      contact_first_name: null,
      contact_last_name: null,
      contact_email: null,
      contact_phone: null,
      source_id: null,
      source_name: null,
    }),
  );

  assert.equal(result.company, null);
  assert.equal(result.contact, null);
  assert.equal(result.source, null);
});

test('toPublicLead handles null optional fields', () => {
  const result = toPublicLead(makeLead({ notes: null }));
  assert.equal(result.notes, null);
});
