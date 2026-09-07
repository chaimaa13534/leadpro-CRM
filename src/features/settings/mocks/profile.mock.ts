/* ═════════════════════════════════════════════════════════════════════
   Settings — Profile Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type {
  AccountInfo,
  AppearancePreferences,
  GeneralPreferences,
  UserProfile,
} from '@/features/settings/types';

/** Préférences générales par défaut (cohérentes avec le reste du CRM). */
export const defaultGeneralPreferences: GeneralPreferences = {
  language: 'fr',
  timezone: 'Europe/Paris',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'EUR',
  firstDayOfWeek: 'monday',
  defaultDashboard: 'dashboard',
  defaultPipeline: 'pipeline-principal',
};

/** Profil utilisateur courant (synchronisé avec `usersMock` — Alex Martin). */
export const profileMock: UserProfile = {
  id: 'user-1',
  firstName: 'Alex',
  lastName: 'Martin',
  email: 'alex.martin@leadpro.io',
  phone: '+33 6 12 34 56 78',
  jobTitle: 'Sales Manager',
  department: 'Sales',
  bio: 'Responsable de l’équipe commerciale. Passionné par la data et les processus de vente B2B.',
  location: 'Paris, France',
  website: 'https://leadpro.io/alex',
  updatedAt: '2026-01-18T09:30:00.000Z',
};

/** Informations du compte utilisateur courant. */
export const accountInfoMock: AccountInfo = {
  id: 'acc-1',
  email: 'alex.martin@leadpro.io',
  username: 'alex.martin',
  status: 'active',
  createdAt: '2024-03-12T10:00:00.000Z',
  lastLoginAt: '2026-01-20T08:45:00.000Z',
};

/** Préférences d’apparence par défaut. */
export const defaultAppearancePreferences: AppearancePreferences = {
  theme: 'system',
  density: 'comfortable',
  sidebar: 'expanded',
  animations: 'enabled',
};

