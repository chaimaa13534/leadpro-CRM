import type { UserRole } from '@/types/user.types';

/** Libellé lisible et description courte pour chaque rôle applicatif. */
export const USER_ROLES: Record<
  UserRole,
  { label: string; description: string }
> = {
  admin: {
    label: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités et réglages.',
  },
  manager: {
    label: 'Manager',
    description: 'Supervise une équipe commerciale et son pipeline.',
  },
  sales_rep: {
    label: 'Commercial',
    description: 'Gère ses propres leads, contacts et opportunités.',
  },
  viewer: {
    label: 'Lecteur',
    description: 'Accès en lecture seule, sans droit de modification.',
  },
};

/** Liste ordonnée des rôles, pratique pour peupler un `<select>`. */
export const USER_ROLE_OPTIONS: UserRole[] = [
  'admin',
  'manager',
  'sales_rep',
  'viewer',
];
