import type { Activity } from '@/types/activity.types';
import { hoursAgo } from '@/mocks/mock-date-helpers';

export const activitiesMock: Activity[] = [
  {
    id: 'activity-1',
    type: 'opportunity_won',
    actorName: 'Sara Idrissi',
    description:
      'a gagné l\'opportunité "Refonte site — Atlas Textile" (48 000 MAD).',
    occurredAt: hoursAgo(1),
  },
  {
    id: 'activity-2',
    type: 'lead_created',
    actorName: 'Yassine Bennani',
    description: 'a créé un nouveau lead pour "Nour Cosmétiques".',
    occurredAt: hoursAgo(2),
  },
  {
    id: 'activity-3',
    type: 'meeting_completed',
    actorName: 'Sara Idrissi',
    description: 'a terminé une réunion de découverte avec "Groupe Kawtar".',
    occurredAt: hoursAgo(4),
  },
  {
    id: 'activity-4',
    type: 'contact_updated',
    actorName: 'Omar Chraibi',
    description: 'a mis à jour les coordonnées de Fatima Zahra Alaoui.',
    occurredAt: hoursAgo(6),
  },
  {
    id: 'activity-5',
    type: 'lead_created',
    actorName: 'Yassine Bennani',
    description: 'a créé un nouveau lead pour "Atlas Logistique".',
    occurredAt: hoursAgo(9),
  },
  {
    id: 'activity-6',
    type: 'opportunity_won',
    actorName: 'Omar Chraibi',
    description:
      'a gagné l\'opportunité "Migration ERP — Sanad Pharma" (126 000 MAD).',
    occurredAt: hoursAgo(23),
  },
];
