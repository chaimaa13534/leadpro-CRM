import type { User } from '@/types/user.types';

const NOW_ISO = new Date().toISOString();

/**
 * Équipe commerciale de démonstration. `user-1` (Alex Martin) sert de
 * compte de connexion (voir `services/auth.service.ts`) — les autres
 * membres n'ont pas de session, ils existent pour peupler `ownerId` sur
 * les leads (colonne "Responsable", filtre par propriétaire…). Ce sont
 * les mêmes noms déjà utilisés dans `activities.mock.ts` depuis le
 * Jour 5, désormais formalisés en véritables comptes.
 */
export const usersMock: User[] = [
  {
    id: 'user-1',
    firstName: 'Alex',
    lastName: 'Martin',
    email: 'alex.martin@leadpro.io',
    role: 'manager',
    company: 'LeadPro CRM',
    status: 'active',
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
    lastLoginAt: NOW_ISO,
  },
  {
    id: 'user-2',
    firstName: 'Sara',
    lastName: 'Idrissi',
    email: 'sara.idrissi@leadpro.io',
    role: 'sales_rep',
    company: 'LeadPro CRM',
    status: 'active',
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  },
  {
    id: 'user-3',
    firstName: 'Yassine',
    lastName: 'Bennani',
    email: 'yassine.bennani@leadpro.io',
    role: 'sales_rep',
    company: 'LeadPro CRM',
    status: 'active',
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  },
  {
    id: 'user-4',
    firstName: 'Omar',
    lastName: 'Chraibi',
    email: 'omar.chraibi@leadpro.io',
    role: 'sales_rep',
    company: 'LeadPro CRM',
    status: 'active',
    createdAt: NOW_ISO,
    updatedAt: NOW_ISO,
  },
];
