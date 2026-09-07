import { SettingsLayout } from '@/features/settings/components/SettingsLayout';

/**
 * Page Settings — Délègue au layout SettingsLayout qui gère la navigation
 * sidebar + les sous-routes (General, Profile, Account…).
 * SettingsLayout utilise <Outlet /> pour render les pages enfants.
 */
export function SettingsPage() {
  return <SettingsLayout />;
}
