import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthenticatedUser, AuthSession, LoginCredentials } from '@/types/user.types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  login as loginRequest,
  logout as logoutRequest,
  fetchProfile,
  removeProfile,
  saveProfile,
  uploadProfileAvatar,
} from '@/services/auth.service';
import {
  AuthContext,
  type AuthContextValue,
} from '@/store/slices/auth-context';

const SESSION_STORAGE_KEY = 'leadpro-crm:session';

export interface AuthProviderProps {
  children: ReactNode;
}

function isSessionExpired(session: AuthSession): boolean {
  return new Date(session.expiresAt).getTime() <= Date.now();
}

const AVATAR_MAX_DIMENSION = 512;
const AVATAR_MAX_DATA_URL_LENGTH = 1_400_000;

function optimizeAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const scale = Math.min(1, AVATAR_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Impossible de pr?parer cette image.');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(objectUrl);
        if (dataUrl.length > AVATAR_MAX_DATA_URL_LENGTH) return reject(new Error('Cette image est trop d?taill?e. Choisissez-en une autre.'));
        resolve(dataUrl);
      } catch (cause) { URL.revokeObjectURL(objectUrl); reject(cause); }
    };
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Impossible de lire cette image.')); };
    image.src = objectUrl;
  });
}

/**
 * Fournit une session d'authentification simulée à toute l'application :
 * aucun backend, aucun JWT réel — le "token" et l'utilisateur sont
 * persistés tels quels dans `localStorage` (voir `useLocalStorage`) afin
 * de survivre à un rechargement de page, comme une vraie session le
 * ferait.
 *
 * Monté au niveau de `App` (au-dessus du routeur) puisque `ProtectedRoute`,
 * `PublicRoute` et `UserMenu` en ont tous besoin.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useLocalStorage<AuthSession | null>(
    SESSION_STORAGE_KEY,
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSession = session && !isSessionExpired(session) ? session : null;

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSession = await loginRequest(credentials);
        setSession(nextSession);
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : 'La connexion a échoué.';
        setError(message);
        throw caughtError;
      } finally {
        setIsLoading(false);
      }
    },
    [setSession],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logoutRequest();
    } finally {
      setSession(null);
      setIsLoading(false);
    }
  }, [setSession]);

  const updateSessionUser = useCallback((user: AuthenticatedUser) => {
    setSession((previous) => (previous ? { ...previous, user } : previous));
    return user;
  }, [setSession]);

  const requireToken = useCallback(() => {
    if (!activeSession) throw new Error('Votre session a expiré.');
    return activeSession.accessToken;
  }, [activeSession]);

  const refreshProfile = useCallback(
    async () => updateSessionUser(await fetchProfile(requireToken())),
    [requireToken, updateSessionUser],
  );
  const updateProfile = useCallback(
    async (input: Pick<AuthenticatedUser, 'firstName' | 'lastName' | 'email' | 'phone'>) =>
      updateSessionUser(await saveProfile(requireToken(), input)),
    [requireToken, updateSessionUser],
  );
  const uploadAvatar = useCallback(async (file: File) => {
    const image = await optimizeAvatar(file);
    return updateSessionUser(await uploadProfileAvatar(requireToken(), image));
  }, [requireToken, updateSessionUser]);
  const deleteAccount = useCallback(async () => {
    await removeProfile(requireToken());
    setSession(null);
  }, [requireToken, setSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: activeSession?.user ?? null,
      isAuthenticated: activeSession !== null,
      isLoading,
      error,
      login,
      logout,
      refreshProfile,
      updateProfile,
      uploadAvatar,
      deleteAccount,
    }),
    [activeSession, isLoading, error, login, logout, refreshProfile, updateProfile, uploadAvatar, deleteAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
