import type {
  AuthSession,
  AuthenticatedUser,
  LoginCredentials,
  UserRole,
} from '@/types/user.types';
import { generateId } from '@/utils/generateId';

const SESSION_DURATION_MS = 1000 * 60 * 60; // 1 heure

interface BackendLoginUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  role: string;
}

interface BackendProfileUser extends BackendLoginUser {}

interface BackendLoginResponse {
  user: BackendLoginUser;
  token: string;
  expiresIn: number;
}

interface BackendApiEnvelope<T> {
  success: true;
  data: T;
}

function normalizeRole(role: string | undefined): UserRole {
  switch (role) {
    case 'admin':
      return 'admin';
    case 'manager':
      return 'manager';
    case 'sales':
    case 'sales_rep':
      return 'sales_rep';
    default:
      return 'viewer';
  }
}

function toAuthenticatedUser(data: BackendProfileUser): AuthenticatedUser {
  return {
    id: String(data.id),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    avatarUrl: data.avatar ?? undefined,
    phone: data.phone ?? undefined,
    role: normalizeRole(data.role),
    permissions: [],
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json().catch(() => null)) as
    | BackendApiEnvelope<T>
    | { message?: string; error?: string }
    | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? payload.message
        : 'La connexion a échoué.';
    throw new Error(message ?? 'La connexion a échoué.');
  }

  if (!payload || typeof payload !== 'object' || !('success' in payload)) {
    throw new Error('Réponse API invalide.');
  }

  return payload.data;
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  const data = await request<BackendLoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const authenticatedUser = toAuthenticatedUser(data.user);

  return {
    user: authenticatedUser,
    accessToken: data.token,
    refreshToken: generateId(),
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
}

/** Termine la session courante côté serveur (invalidation du token). */
export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => undefined);
}

/** Récupère l'utilisateur actuellement authentifié, ou `null` sinon. */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  return null;
}

function authorized(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchProfile(token: string): Promise<AuthenticatedUser> {
  return toAuthenticatedUser(
    await request<BackendProfileUser>('/api/profile', { headers: authorized(token) }),
  );
}

export async function saveProfile(
  token: string,
  input: Pick<AuthenticatedUser, 'firstName' | 'lastName' | 'email' | 'phone'>,
): Promise<AuthenticatedUser> {
  return toAuthenticatedUser(
    await request<BackendProfileUser>('/api/profile', {
      method: 'PATCH', headers: authorized(token), body: JSON.stringify(input),
    }),
  );
}

export async function uploadProfileAvatar(token: string, image: string): Promise<AuthenticatedUser> {
  return toAuthenticatedUser(
    await request<BackendProfileUser>('/api/profile/avatar', {
      method: 'POST', headers: authorized(token), body: JSON.stringify({ image }),
    }),
  );
}

export async function removeProfile(token: string): Promise<void> {
  await request<{ message: string }>('/api/profile', { method: 'DELETE', headers: authorized(token) });
}

/**
 * Déclenche l'envoi (simulé) d'un email de réinitialisation de mot de
 * passe. Ne révèle jamais si l'email existe ou non (bonne pratique de
 * sécurité) — la promesse se résout toujours avec succès.
 */
export function forgotPassword(_email: string): Promise<void> {
  return Promise.resolve();
}

/**
 * Applique un nouveau mot de passe à partir d'un jeton de
 * réinitialisation. `token` sera un vrai jeton signé côté backend plus
 * tard ; aujourd'hui, seule sa présence est vérifiée.
 */
export function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  if (!token || newPassword.length < 8) {
    return Promise.reject(
      new Error(
        'Le lien de réinitialisation est invalide ou le mot de passe est trop court.',
      ),
    );
  }

  return Promise.resolve();
}
