import type { ID, ISODateString } from '@/types/common.types';

/**
 * Rôles applicatifs. Source de vérité pour ce type ; la liste runtime
 * correspondante (pour peupler des selects, etc.) vit dans
 * `lib/constants/roles.constants.ts` et est dérivée de ce même type.
 */
export type UserRole = 'admin' | 'manager' | 'sales_rep' | 'viewer';

/**
 * Statut du compte. Remplace le précédent booléen `isActive` (Jour 2) —
 * un statut à trois valeurs est plus expressif (un compte invité n'est
 * ni "actif" ni "désactivé") et correspond au modèle complet demandé au
 * Jour 6.
 */
export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  company?: string;
  phone?: string;
  status?: UserStatus;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
  lastLoginAt?: ISODateString;
}

/** Utilisateur actuellement authentifié, tel qu'exposé par `useAuth`. */
export interface AuthenticatedUser extends User {
  permissions: string[];
}

/** Identifiants soumis lors de la connexion. */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Résultat renvoyé après une authentification réussie. */
export interface AuthSession {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: ISODateString;
}
