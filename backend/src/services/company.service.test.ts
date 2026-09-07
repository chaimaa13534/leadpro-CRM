import test from 'node:test';
import assert from 'node:assert/strict';
import { toPublicCompany } from './company.service.js';
import type { CompanyWithOwner } from '../types/company.types.js';

function makeCompany(overrides: Partial<CompanyWithOwner> = {}): CompanyWithOwner {
  return {
    id: 1,
    name: 'TechNova SAS',
    industry: 'Technologie',
    website: 'https://technova.fr',
    phone: '+33 1 40 00 00 01',
    email: 'contact@technova.fr',
    address: '12 rue de la Paix',
    city: 'Paris',
    country: 'France',
    notes: 'Client stratégique',
    owner_id: 1,
    owner_first_name: 'Sarah',
    owner_last_name: 'Léger',
    owner_email: 'sarah.leger@leadpro.com',
    owner_avatar: null,
    contact_count: 2,
    opportunity_count: 1,
    lead_count: 1,
    created_at: new Date('2025-01-13T09:00:00Z'),
    updated_at: new Date('2025-01-13T09:00:00Z'),
    deleted_at: null,
    ...overrides,
  };
}

test('toPublicCompany maps all fields correctly', () => {
  const company = makeCompany();
  const result = toPublicCompany(company);

  assert.equal(result.id, 1);
  assert.equal(result.name, 'TechNova SAS');
  assert.equal(result.industry, 'Technologie');
  assert.equal(result.website, 'https://technova.fr');
  assert.equal(result.phone, '+33 1 40 00 00 01');
  assert.equal(result.email, 'contact@technova.fr');
  assert.equal(result.address, '12 rue de la Paix');
  assert.equal(result.city, 'Paris');
  assert.equal(result.country, 'France');
  assert.equal(result.description, 'Client stratégique');
  assert.equal(result.contactCount, 2);
  assert.equal(result.opportunityCount, 1);
  assert.equal(result.leadCount, 1);
  assert.equal(result.createdAt, company.created_at);
  assert.equal(result.updatedAt, company.updated_at);
});

test('toPublicCompany maps the owner to a nested object', () => {
  const result = toPublicCompany(makeCompany());

  assert.deepEqual(result.owner, {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Léger',
    email: 'sarah.leger@leadpro.com',
    avatar: null,
  });
});

test('toPublicCompany never exposes the raw owner_id', () => {
  const result = toPublicCompany(makeCompany());
  assert.ok(!('owner_id' in result));
  assert.ok(!('owner_first_name' in result));
});

test('toPublicCompany handles null optional fields', () => {
  const result = toPublicCompany(
    makeCompany({
      industry: null,
      website: null,
      phone: null,
      email: null,
      address: null,
      city: null,
      country: null,
      notes: null,
    }),
  );

  assert.equal(result.industry, null);
  assert.equal(result.website, null);
  assert.equal(result.phone, null);
  assert.equal(result.email, null);
  assert.equal(result.address, null);
  assert.equal(result.city, null);
  assert.equal(result.country, null);
  assert.equal(result.description, null);
});
