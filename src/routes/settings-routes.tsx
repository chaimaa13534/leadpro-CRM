/* ═════════════════════════════════════════════════════════════════════
   Settings — Routes configuration
   Définit les 13 sous-routes sous /settings/*. Le layout SettingsLayout
   est monté par SettingsPage (voir src/pages/SettingsPage.tsx).
   ═════════════════════════════════════════════════════════════════════ */

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const GeneralSettingsPage = lazy(() =>
  import('@/features/settings/pages/GeneralSettingsPage').then((m) => ({
    default: m.GeneralSettingsPage,
  })),
);

const ProfileSettingsPage = lazy(() =>
  import('@/features/settings/pages/ProfileSettingsPage').then((m) => ({
    default: m.ProfileSettingsPage,
  })),
);

const AccountSettingsPage = lazy(() =>
  import('@/features/settings/pages/AccountSettingsPage').then((m) => ({
    default: m.AccountSettingsPage,
  })),
);

const OrganizationSettingsPage = lazy(() =>
  import('@/features/settings/pages/OrganizationSettingsPage').then((m) => ({
    default: m.OrganizationSettingsPage,
  })),
);

const AppearanceSettingsPage = lazy(() =>
  import('@/features/settings/pages/AppearanceSettingsPage').then((m) => ({
    default: m.AppearanceSettingsPage,
  })),
);

const NotificationSettingsPage = lazy(() =>
  import('@/features/settings/pages/NotificationSettingsPage').then((m) => ({
    default: m.NotificationSettingsPage,
  })),
);

const SecuritySettingsPage = lazy(() =>
  import('@/features/settings/pages/SecuritySettingsPage').then((m) => ({
    default: m.SecuritySettingsPage,
  })),
);

const TeamSettingsPage = lazy(() =>
  import('@/features/settings/pages/TeamSettingsPage').then((m) => ({
    default: m.TeamSettingsPage,
  })),
);

const RolesPermissionsPage = lazy(() =>
  import('@/features/settings/pages/RolesPermissionsPage').then((m) => ({
    default: m.RolesPermissionsPage,
  })),
);

const IntegrationsSettingsPage = lazy(() =>
  import('@/features/settings/pages/IntegrationsSettingsPage').then((m) => ({
    default: m.IntegrationsSettingsPage,
  })),
);

const DataPrivacySettingsPage = lazy(() =>
  import('@/features/settings/pages/DataPrivacySettingsPage').then((m) => ({
    default: m.DataPrivacySettingsPage,
  })),
);

const BillingSettingsPage = lazy(() =>
  import('@/features/settings/pages/BillingSettingsPage').then((m) => ({
    default: m.BillingSettingsPage,
  })),
);

const AdvancedSettingsPage = lazy(() =>
  import('@/features/settings/pages/AdvancedSettingsPage').then((m) => ({
    default: m.AdvancedSettingsPage,
  })),
);

/** Routes imbriquées sous /settings. */
export const settingsRoutes: RouteObject[] = [
  {
    index: true,
    element: <ProfileSettingsPage />,
  },
  { path: 'profile', element: <ProfileSettingsPage /> },
  { path: 'account', element: <AccountSettingsPage /> },
  { path: 'organization', element: <OrganizationSettingsPage /> },
  { path: 'appearance', element: <AppearanceSettingsPage /> },
  { path: 'notifications', element: <NotificationSettingsPage /> },
  { path: 'security', element: <SecuritySettingsPage /> },
  { path: 'team', element: <TeamSettingsPage /> },
  { path: 'roles', element: <RolesPermissionsPage /> },
  { path: 'integrations', element: <IntegrationsSettingsPage /> },
  { path: 'privacy', element: <DataPrivacySettingsPage /> },
  { path: 'billing', element: <BillingSettingsPage /> },
  { path: 'advanced', element: <AdvancedSettingsPage /> },
];
