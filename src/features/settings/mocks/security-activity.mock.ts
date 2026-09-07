/* ═════════════════════════════════════════════════════════════════════
   Settings — Security Activity Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type {
  SecurityActivityEvent,
  TwoFactorStatus,
} from '@/features/settings/types';

/** Statut 2FA simulé (aucun mécanisme réel derrière). */
export const twoFactorStatusMock: TwoFactorStatus = {
  enabled: false,
  method: undefined,
  recoveryCodesCount: 0,
};

/** Historique d’activité sécurité, présenté sous forme de timeline. */
export const securityActivityMock: SecurityActivityEvent[] = [
  {
    id: 'sec-1',
    type: 'login',
    title: 'Connexion réussie',
    description: 'Nouvelle connexion depuis Chrome sous Windows 11.',
    location: 'Paris, France',
    device: 'Desktop · Windows 11',
    occurredAt: '2026-01-20T08:45:00.000Z',
  },
  {
    id: 'sec-2',
    type: 'security_alert',
    title: 'Alerte de sécurité',
    description: 'Tentative de connexion depuis un appareil inconnu bloquée.',
    location: 'Berlin, Allemagne',
    device: 'Mobile · Android 15',
    occurredAt: '2026-01-19T22:18:00.000Z',
  },
  {
    id: 'sec-3',
    type: 'password_change',
    title: 'Mot de passe modifié',
    description: 'Le mot de passe du compte a été mis à jour.',
    device: 'Desktop · macOS 15',
    occurredAt: '2025-12-02T11:30:00.000Z',
  },
  {
    id: 'sec-4',
    type: 'session_revoked',
    title: 'Session révoquée',
    description: 'Une session active sur un appareil mobile a été révoquée.',
    device: 'Mobile · iOS 17',
    occurredAt: '2025-11-21T16:40:00.000Z',
  },
  {
    id: 'sec-5',
    type: 'two_factor_enabled',
    title: '2FA activée',
    description: 'Authentification à deux facteurs activée sur le compte.',
    device: 'Desktop · Chrome',
    occurredAt: '2025-10-14T09:00:00.000Z',
  },
  {
    id: 'sec-6',
    type: 'two_factor_disabled',
    title: '2FA désactivée',
    description: 'Authentification à deux facteurs désactivée sur le compte.',
    device: 'Desktop · Chrome',
    occurredAt: '2025-10-20T09:15:00.000Z',
  },
  {
    id: 'sec-7',
    type: 'email_changed',
    title: 'Email de contact mis à jour',
    description: 'L’adresse email associée au compte a été modifiée.',
    device: 'Desktop · Edge',
    occurredAt: '2025-09-02T13:05:00.000Z',
  },
];

