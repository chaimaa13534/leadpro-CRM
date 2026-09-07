import { createContext } from 'react';
import type { AuthenticatedUser, LoginCredentials } from '@/types/user.types';

export interface AuthContextValue {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AuthenticatedUser>;
  updateProfile: (
    input: Pick<AuthenticatedUser, 'firstName' | 'lastName' | 'email' | 'phone'>,
  ) => Promise<AuthenticatedUser>;
  uploadAvatar: (file: File) => Promise<AuthenticatedUser>;
  deleteAccount: () => Promise<void>;
}

/**
 * Contexte de session, persisté dans `localStorage` (voir
 * `AuthProvider`) — une "fausse session" puisqu'aucun backend n'existe
 * encore. Défini séparément de `AuthProvider` pour ne pas mélanger
 * export de composant et export de valeur (meilleure compatibilité Fast
 * Refresh), même pattern que `layout-context.ts`.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
