/* ═════════════════════════════════════════════════════════════════════
   Settings — Service (simulated)
   ═════════════════════════════════════════════════════════════════════
   Couche service "prête pour une future API REST/GraphQL" : toutes les
   fonctions renvoient des `Promise` et s’appuient sur la latence simulée.
   Les données persistées passent par `settings-storage` (localStorage).
   ═════════════════════════════════════════════════════════════════════ */

import type {
  AccountInfo,
  AdvancedOptions,
  AppearancePreferences,
  DataPrivacyPreferences,
  GeneralPreferences,
  Integration,
  NotificationPreferences,
  Organization,
  SecurityActivityEvent,
  SessionDevice,
  TeamMember,
  TwoFactorStatus,
  UserProfile,
} from '@/features/settings/types';
import {
  accountInfoMock,
  integrationsMock,
  organizationMock,
  securityActivityMock,
  sessionsMock,
  teamMock,
  twoFactorStatusMock,
} from '@/features/settings/mocks';
import {
  clearAllSettings,
  getAdvancedOptions,
  getAppearancePreferences,
  getDataPrivacyPreferences,
  getNotificationPreferences,
  getPreferences,
  getProfile,
  saveAdvancedOptions,
  saveAppearancePreferences,
  saveDataPrivacyPreferences,
  saveNotificationPreferences,
  savePreferences,
  saveProfile,
} from '@/features/settings/utils';
import { generateId } from '@/utils/generateId';

/** Latence simulée pour reproduire un appel réseau. */
function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/* ── General ── */

export function getGeneralPreferences(): Promise<GeneralPreferences> {
  return delay({ ...getPreferences() });
}

export function updateGeneralPreferences(
  preferences: GeneralPreferences,
): Promise<GeneralPreferences> {
  savePreferences(preferences);
  return delay({ ...preferences });
}

export function resetGeneralPreferences(): Promise<GeneralPreferences> {
  const fallback = {
    language: 'fr' as const,
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY' as const,
    timeFormat: '24h' as const,
    currency: 'EUR' as const,
    firstDayOfWeek: 'monday' as const,
    defaultDashboard: 'dashboard' as const,
    defaultPipeline: 'pipeline-principal',
  };
  savePreferences(fallback);
  return delay({ ...fallback });
}

/* ── Profile ── */

export function getProfileSettings(): Promise<UserProfile> {
  return delay({ ...getProfile() });
}

export function updateProfile(profile: UserProfile): Promise<UserProfile> {
  saveProfile(profile);
  return delay({ ...profile });
}

/* ── Account ── */

export function getAccountInfo(): Promise<AccountInfo> {
  return delay({ ...accountInfoMock });
}

/* ── Organization ── */

export function getOrganization(): Promise<Organization> {
  return delay({ ...organizationMock });
}

export function updateOrganization(
  organization: Organization,
): Promise<Organization> {
  return delay({ ...organization });
}

/* ── Appearance ── */

export function getAppearance(): Promise<AppearancePreferences> {
  return delay({ ...getAppearancePreferences() });
}

export function updateAppearance(
  preferences: AppearancePreferences,
): Promise<AppearancePreferences> {
  saveAppearancePreferences(preferences);
  return delay({ ...preferences });
}

/* ── Notifications ── */

export function getNotificationPreferencesData(): Promise<NotificationPreferences> {
  return delay({ ...getNotificationPreferences() });
}

export function updateNotificationPreferencesData(
  preferences: NotificationPreferences,
): Promise<NotificationPreferences> {
  saveNotificationPreferences(preferences);
  return delay({ ...preferences });
}

/* ── Security ── */

export function getSessions(): Promise<SessionDevice[]> {
  return delay(sessionsMock.map((session) => ({ ...session })));
}

export function revokeSession(sessionId: string): Promise<void> {
  return delay(undefined, 200);
}

export function getTwoFactorStatus(): Promise<TwoFactorStatus> {
  return delay({ ...twoFactorStatusMock });
}

export function enableTwoFactor(): Promise<TwoFactorStatus> {
  return delay({
    enabled: true,
    method: 'app',
    verifiedAt: new Date().toISOString(),
    recoveryCodesCount: 10,
  });
}

export function disableTwoFactor(): Promise<TwoFactorStatus> {
  return delay({
    enabled: false,
    method: undefined,
    recoveryCodesCount: 0,
  });
}

export function getSecurityActivity(): Promise<SecurityActivityEvent[]> {
  return delay(securityActivityMock.map((event) => ({ ...event })));
}

/* ── Team ── */

export function getTeamMembers(): Promise<TeamMember[]> {
  return delay(teamMock.map((member) => ({ ...member })));
}

export function inviteTeamMember(
  input: Omit<TeamMember, 'id' | 'status' | 'invitedAt'>,
): Promise<TeamMember> {
  const member: TeamMember = {
    ...input,
    id: generateId(),
    status: 'invited',
    invitedAt: new Date().toISOString(),
  };
  return delay(member, 400);
}

export function removeTeamMember(memberId: string): Promise<void> {
  return delay(undefined, 200);
}

/* ── Integrations ── */

export function getIntegrations(): Promise<Integration[]> {
  return delay(integrationsMock.map((integration) => ({ ...integration })));
}

/* ── Data & Privacy ── */

export function getDataPrivacy(): Promise<DataPrivacyPreferences> {
  return delay({ ...getDataPrivacyPreferences() });
}

export function updateDataPrivacy(
  preferences: DataPrivacyPreferences,
): Promise<DataPrivacyPreferences> {
  saveDataPrivacyPreferences(preferences);
  return delay({ ...preferences });
}

/* ── Advanced ── */

export function getAdvancedSettings(): Promise<AdvancedOptions> {
  return delay({ ...getAdvancedOptions() });
}

export function updateAdvancedSettings(
  options: AdvancedOptions,
): Promise<AdvancedOptions> {
  saveAdvancedOptions(options);
  return delay({ ...options });
}

export function clearLocalData(): Promise<void> {
  return delay(undefined, 400);
}

export function resetApplication(): Promise<void> {
  clearAllSettings();
  return delay(undefined, 600);
}

