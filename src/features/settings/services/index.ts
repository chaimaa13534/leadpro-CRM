/* ═════════════════════════════════════════════════════════════════════
   Settings & Administration — Services (barrel)
   ═════════════════════════════════════════════════════════════════════ */

export {
  getGeneralPreferences,
  updateGeneralPreferences,
  resetGeneralPreferences,
  getProfileSettings,
  updateProfile,
  getAccountInfo,
  getOrganization,
  updateOrganization,
  getAppearance,
  updateAppearance,
  getNotificationPreferencesData,
  updateNotificationPreferencesData,
  getSessions,
  revokeSession,
  getTwoFactorStatus,
  enableTwoFactor,
  disableTwoFactor,
  getSecurityActivity,
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  getIntegrations,
  getDataPrivacy,
  updateDataPrivacy,
  getAdvancedSettings,
  updateAdvancedSettings,
  clearLocalData,
  resetApplication,
} from '@/features/settings/services/settings.service';

