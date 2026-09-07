/* ═════════════════════════════════════════════════════════════════════
   Settings — Organization Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type { Organization } from '@/features/settings/types';

/** Organisation de démonstration LeadPro CRM. */
export const organizationMock: Organization = {
  id: 'org-1',
  name: 'LeadPro CRM',
  industry: 'SaaS · CRM',
  website: 'https://leadpro.io',
  phone: '+33 1 84 88 40 40',
  email: 'contact@leadpro.io',
  country: 'France',
  city: 'Paris',
  address: '12 rue de la Boétie',
  postalCode: '75008',
  companySize: '11-50',
  taxId: 'FR 12 345 678 901',
  description:
    'LeadPro aide les équipes commerciales à piloter leurs leads, opportunités et revenus dans un CRM moderne et intuitif.',
  updatedAt: '2026-01-10T14:00:00.000Z',
};

