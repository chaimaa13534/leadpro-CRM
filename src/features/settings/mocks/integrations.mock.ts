/* ═════════════════════════════════════════════════════════════════════
   Settings — Integrations Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type { Integration } from '@/features/settings/types';

/** Intégrations fictives — aucun service externe n’est réellement contacté. */
export const integrationsMock: Integration[] = [
  {
    id: 'int-google-calendar',
    name: 'Google Calendar',
    description: 'Synchronisez vos événements et tâches avec Google Calendar.',
    category: 'calendar',
    status: 'connected',
    connectedAt: '2025-11-04T10:00:00.000Z',
    color: '#4285F4',
  },
  {
    id: 'int-outlook',
    name: 'Microsoft Outlook',
    description: 'Connectez vos calendriers et rendez-vous Outlook.',
    category: 'calendar',
    status: 'available',
    color: '#0078D4',
  },
  {
    id: 'int-gmail',
    name: 'Gmail',
    description: 'Recevez vos notifications par email et suivez vos conversations.',
    category: 'email',
    status: 'connected',
    connectedAt: '2025-10-02T09:30:00.000Z',
    color: '#EA4335',
  },
  {
    id: 'int-slack',
    name: 'Slack',
    description: 'Recevez des alertes et résumés directement dans vos canaux.',
    category: 'communication',
    status: 'available',
    color: '#4A154B',
  },
  {
    id: 'int-teams',
    name: 'Microsoft Teams',
    description: 'Partagez les mises à jour CRM dans vos équipes Teams.',
    category: 'communication',
    status: 'available',
    color: '#6264A7',
  },
  {
    id: 'int-zapier',
    name: 'Zapier',
    description: 'Automatisez vos workflows en connectant LeadPro à 6 000+ apps.',
    category: 'automation',
    status: 'connected',
    connectedAt: '2025-08-21T14:20:00.000Z',
    color: '#FF4F00',
  },
  {
    id: 'int-stripe',
    name: 'Stripe',
    description: 'Suivez vos paiements et rapprochez vos revenus du pipeline.',
    category: 'payments',
    status: 'coming_soon',
    color: '#635BFF',
  },
];

