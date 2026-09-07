import { useContext } from 'react';
import {
  AuthContext,
  type AuthContextValue,
} from '@/store/slices/auth-context';

/**
 * Accès à la session d'authentification (utilisateur, `login`, `logout`,
 * états de chargement/erreur). Doit être utilisé sous `AuthProvider`
 * (monté dans `App`).
 *
 * Ce hook gérait auparavant un état local (Jour 2) ; il consomme
 * désormais le contexte global, comme prévu dès le Jour 2 : "l'état sera
 * déplacé vers le store global une fois qu'un mécanisme de partage
 * d'état inter-composants sera choisi."
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé sous un <AuthProvider>.');
  }

  return context;
}
