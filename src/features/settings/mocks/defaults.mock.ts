/* ═════════════════════════════════════════════════════════════════════
   Settings — Default Preferences Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type {
  AdvancedOptions,
  DataPrivacyPreferences,
  NotificationPreferences,
} from '@/features/settings/types';

/** Préférences de notifications par défaut. */
export const defaultNotificationPreferences: NotificationPreferences = {
  email: {
    leads: true,
    contacts: true,
    companies: true,
    opportunities: true,
    pipeline: true,
    calendar: true,
    tasks: true,
    reports: true,
    assistant: true,
    recommendations: true,
    insights: false,
    loginAlerts: true,
    securityAlerts: true,
    productUpdates: false,
    marketingEmails: false,
  },
  desktop: {
    leads: true,
    contacts: true,
    companies: true,
    opportunities: true,
    pipeline: true,
    calendar: true,
    tasks: true,
    reports: false,
    assistant: true,
    recommendations: true,
    insights: true,
    loginAlerts: false,
    securityAlerts: true,
  },
  push: {
    leads: true,
    contacts: false,
    companies: false,
    opportunities: true,
    pipeline: false,
    calendar: true,
    tasks: true,
    reports: false,
    assistant: true,
    recommendations: false,
    insights: false,
  },
};

/** Options avancées par défaut. */
export const defaultAdvancedOptions: AdvancedOptions = {
  developerMode: false,
  debugMode: false,
  experimentalFeatures: false,
  performanceMode: true,
  animations: true,
};

/** Préférences de données et confidentialité par défaut. */
export const defaultDataPrivacyPreferences: DataPrivacyPreferences = {
  analytics: true,
  activityTracking: true,
  cookies: true,
};

