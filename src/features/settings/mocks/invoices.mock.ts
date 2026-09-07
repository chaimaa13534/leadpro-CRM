/* ═════════════════════════════════════════════════════════════════════
   Settings — Billing Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type {
  Invoice,
  Plan,
  PlanUsage,
} from '@/features/settings/types';

/** Plans disponibles — montants simulés, aucun paiement réel. */
export const plansMock: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'monthly',
    description: 'Pour découvrir LeadPro en solo.',
    features: [
      'Jusqu’à 3 utilisateurs',
      '100 contacts & 100 leads',
      'Pipeline visuel',
      'Rapports de base',
      'Support par email',
    ],
    limits: {
      users: 3,
      contacts: 100,
      leads: 100,
      storageGB: 1,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29,
    period: 'monthly',
    description: 'Pour les équipes commerciales en croissance.',
    features: [
      'Jusqu’à 15 utilisateurs',
      '5 000 contacts & leads illimités',
      'Automatisations et intégrations',
      'Rapports avancés & exports',
      'Support prioritaire',
    ],
    limits: {
      users: 15,
      contacts: 5000,
      leads: 5000,
      storageGB: 50,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 79,
    period: 'monthly',
    description: 'Pour les organisations à grande échelle.',
    features: [
      'Utilisateurs illimités',
      'Contacts & leads illimités',
      'SLA dédié et onboarding',
      'SSO & permissions avancées',
      'Support 24/7',
    ],
    limits: {
      users: Infinity,
      contacts: Infinity,
      leads: Infinity,
      storageGB: 500,
    },
  },
];

/** Plan actuel souscrit par l’organisation de démo. */
export const currentPlanMock: Plan = plansMock[1]!;

/** Consommation actuelle du plan. */
export const planUsageMock: PlanUsage = {
  users: { used: 6, limit: 15 },
  contacts: { used: 1820, limit: 5000 },
  leads: { used: 2340, limit: 5000 },
  storageGB: { used: 18, limit: 50 },
};

/** Historique de facturation simulé. */
export const invoicesMock: Invoice[] = [
  {
    id: 'inv-1',
    number: 'INV-2026-001',
    date: '2026-01-01T00:00:00.000Z',
    amount: 29,
    currency: 'EUR',
    status: 'paid',
    description: 'Abonnement Professional — Janvier 2026',
  },
  {
    id: 'inv-2',
    number: 'INV-2025-012',
    date: '2025-12-01T00:00:00.000Z',
    amount: 29,
    currency: 'EUR',
    status: 'paid',
    description: 'Abonnement Professional — Décembre 2025',
  },
  {
    id: 'inv-3',
    number: 'INV-2025-011',
    date: '2025-11-01T00:00:00.000Z',
    amount: 29,
    currency: 'EUR',
    status: 'paid',
    description: 'Abonnement Professional — Novembre 2025',
  },
  {
    id: 'inv-4',
    number: 'INV-2025-010',
    date: '2025-10-01T00:00:00.000Z',
    amount: 29,
    currency: 'EUR',
    status: 'pending',
    description: 'Abonnement Professional — Octobre 2025',
  },
  {
    id: 'inv-5',
    number: 'INV-2025-009',
    date: '2025-09-01T00:00:00.000Z',
    amount: 29,
    currency: 'EUR',
    status: 'overdue',
    description: 'Abonnement Professional — Septembre 2025',
  },
];

