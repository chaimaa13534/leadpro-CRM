import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEmail } from './auth.service.js';

test('normalizeEmail trims whitespace and lowercases the email', () => {
  assert.equal(
    normalizeEmail('  Sarah.Léger@LeadPro.com  '),
    'sarah.léger@leadpro.com',
  );
});
