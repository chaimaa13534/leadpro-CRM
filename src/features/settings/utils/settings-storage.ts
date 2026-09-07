/* ═════════════════════════════════════════════════════════════════════
   Settings — Storage Abstraction
   ═════════════════════════════════════════════════════════════════════
   Toute lecture/écriture `localStorage` liée aux réglages passe par ce
   module. Ne jamais y stocker de mots de passe, secrets, tokens ou clés
   API — uniquement des préférences d’interface et de configuration.
   ═════════════════════════════════════════════════════════════════════ */

import type {
  AdvancedOptions,
  AppearancePreferences,
  DataPrivacyPreferences,
  GeneralPreferences,
  NotificationPreferences,
  UserProfile,
} from '@/features/settings/types';
import {
  defaultAdvancedOptions,
  defaultAppearancePreferences,
  defaultDataPrivacyPreferences,
  defaultGeneralPreferences,
  defaultNotificationPreferences,
  profileMock,
} from '@/features/settings/mocks';

/** Préfixe commun à toutes les clés de réglages. */
export const SETTINGS_STORAGE_PREFIX = 'leadpro-crm:settings';

function buildKey(key: string): string {
  return `${SETTINGS_STORAGE_PREFIX}:${key}`;
}

/** Clés de stockage internes — documentées ici pour l’audit. */
export const SETTINGS_STORAGE_KEYS = {
  theme: buildKey('theme'),
  preferences: buildKey('preferences'),
  sidebarState: buildKey('sidebar-state'),
  userSettings: buildKey('user-settings'),
  profile: buildKey('profile'),
  notificationPreferences: buildKey('notification-preferences'),
  advancedOptions: buildKey('advanced-options'),
  dataPrivacy: buildKey('data-privacy'),
} as const;

/* ── Helpers génériques ── */

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Stockage indisponible (mode privé, quota) — l’état React reste valide.
  }
}

function remove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignoré.
  }
}

/* ── API publique (utilisée par les hooks) ── */

export function saveTheme(theme: 'light' | 'dark'): void {
  write(SETTINGS_STORAGE_KEYS.theme, theme);
}

export function getStoredTheme(): 'light' | 'dark' | null {
  return read<'light' | 'dark' | null>(SETTINGS_STORAGE_KEYS.theme, null);
}

export function savePreferences(preferences: GeneralPreferences): void {
  write(SETTINGS_STORAGE_KEYS.preferences, preferences);
}

export function getPreferences(): GeneralPreferences {
  return read(SETTINGS_STORAGE_KEYS.preferences, defaultGeneralPreferences);
}

export function saveSidebarState(state: 'expanded' | 'collapsed'): void {
  write(SETTINGS_STORAGE_KEYS.sidebarState, state);
}

export function getSidebarState(): 'expanded' | 'collapsed' {
  return read<'expanded' | 'collapsed'>(
    SETTINGS_STORAGE_KEYS.sidebarState,
    defaultAppearancePreferences.sidebar,
  );
}

export function saveAppearancePreferences(
  preferences: AppearancePreferences,
): void {
  write(SETTINGS_STORAGE_KEYS.userSettings, preferences);
}

export function getAppearancePreferences(): AppearancePreferences {
  return read(
    SETTINGS_STORAGE_KEYS.userSettings,
    defaultAppearancePreferences,
  );
}

export function saveUserSettings(settings: AppearancePreferences): void {
  write(SETTINGS_STORAGE_KEYS.userSettings, settings);
}

export function getUserSettings(): AppearancePreferences {
  return read(
    SETTINGS_STORAGE_KEYS.userSettings,
    defaultAppearancePreferences,
  );
}

export function saveProfile(profile: UserProfile): void {
  write(SETTINGS_STORAGE_KEYS.profile, profile);
}

export function getProfile(): UserProfile {
  return read(SETTINGS_STORAGE_KEYS.profile, profileMock);
}

export function saveNotificationPreferences(
  preferences: NotificationPreferences,
): void {
  write(SETTINGS_STORAGE_KEYS.notificationPreferences, preferences);
}

export function getNotificationPreferences(): NotificationPreferences {
  return read(
    SETTINGS_STORAGE_KEYS.notificationPreferences,
    defaultNotificationPreferences,
  );
}

export function saveAdvancedOptions(options: AdvancedOptions): void {
  write(SETTINGS_STORAGE_KEYS.advancedOptions, options);
}

export function getAdvancedOptions(): AdvancedOptions {
  return read(SETTINGS_STORAGE_KEYS.advancedOptions, defaultAdvancedOptions);
}

export function saveDataPrivacyPreferences(
  preferences: DataPrivacyPreferences,
): void {
  write(SETTINGS_STORAGE_KEYS.dataPrivacy, preferences);
}

export function getDataPrivacyPreferences(): DataPrivacyPreferences {
  return read(
    SETTINGS_STORAGE_KEYS.dataPrivacy,
    defaultDataPrivacyPreferences,
  );
}

/* ── Actions de réinitialisation ── */

export function clearAllSettings(): void {
  Object.values(SETTINGS_STORAGE_KEYS).forEach(remove);
}

