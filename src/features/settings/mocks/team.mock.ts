/* ═════════════════════════════════════════════════════════════════════
   Settings — Team Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type { TeamMember } from '@/features/settings/types';

/** Équipe de démonstration, cohérente avec `usersMock` (mêmes identités). */
export const teamMock: TeamMember[] = [
  {
    id: 'user-1',
    firstName: 'Alex',
    lastName: 'Martin',
    email: 'alex.martin@leadpro.io',
    role: 'manager',
    department: 'Sales',
    status: 'active',
    invitedAt: '2024-03-12T10:00:00.000Z',
    lastActiveAt: '2026-01-20T08:45:00.000Z',
  },
  {
    id: 'user-2',
    firstName: 'Sara',
    lastName: 'Idrissi',
    email: 'sara.idrissi@leadpro.io',
    role: 'sales_rep',
    department: 'Sales',
    status: 'active',
    invitedAt: '2024-05-02T09:00:00.000Z',
    lastActiveAt: '2026-01-19T17:20:00.000Z',
  },
  {
    id: 'user-3',
    firstName: 'Yassine',
    lastName: 'Bennani',
    email: 'yassine.bennani@leadpro.io',
    role: 'sales_rep',
    department: 'Sales',
    status: 'active',
    invitedAt: '2024-06-18T11:30:00.000Z',
    lastActiveAt: '2026-01-18T15:05:00.000Z',
  },
  {
    id: 'user-4',
    firstName: 'Omar',
    lastName: 'Chraibi',
    email: 'omar.chraibi@leadpro.io',
    role: 'sales_rep',
    department: 'Sales',
    status: 'invited',
    invitedAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'user-5',
    firstName: 'Leila',
    lastName: 'Benali',
    email: 'leila.benali@leadpro.io',
    role: 'marketing',
    department: 'Marketing',
    status: 'active',
    invitedAt: '2024-08-05T13:45:00.000Z',
    lastActiveAt: '2026-01-19T09:12:00.000Z',
  },
  {
    id: 'user-6',
    firstName: 'Mehdi',
    lastName: 'El Fassi',
    email: 'mehdi.elfassi@leadpro.io',
    role: 'admin',
    department: 'Operations',
    status: 'active',
    invitedAt: '2024-02-20T10:15:00.000Z',
    lastActiveAt: '2026-01-20T07:30:00.000Z',
  },
];

