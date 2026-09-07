/**
 * Chemins de routes centralisés. Toute navigation (`<Link>`, `navigate()`,
 * configuration de `react-router`) doit utiliser ces constantes plutôt que
 * des chaînes brutes, pour éviter les typos et centraliser les changements
 * de structure d'URL.
 */
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // App
  DASHBOARD: '/',
  LEADS: '/leads',
  NEW_LEAD: '/leads/new',
  LEAD_DETAILS: '/leads/:leadId',
  CONTACTS: '/contacts',
  NEW_CONTACT: '/contacts/new',
  CONTACT_DETAILS: '/contacts/:contactId',
  EDIT_CONTACT: '/contacts/:contactId/edit',
  COMPANIES: '/companies',
  NEW_COMPANY: '/companies/new',
  COMPANY_DETAILS: '/companies/:companyId',
  EDIT_COMPANY: '/companies/:companyId/edit',
  OPPORTUNITIES: '/opportunities',
  NEW_OPPORTUNITY: '/opportunities/new',
  OPPORTUNITY_DETAILS: '/opportunities/:opportunityId',
  EDIT_OPPORTUNITY: '/opportunities/:opportunityId/edit',
  PIPELINE: '/pipeline',
  TASKS: '/tasks',
  CALENDAR: '/calendar',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  ACTIVITY: '/activity',
  SETTINGS: '/settings',
  SETTINGS_GENERAL: '/settings/general',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_ORGANIZATION: '/settings/organization',
  SETTINGS_APPEARANCE: '/settings/appearance',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SECURITY: '/settings/security',
  SETTINGS_TEAM: '/settings/team',
  SETTINGS_ROLES: '/settings/roles',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  SETTINGS_PRIVACY: '/settings/privacy',
  SETTINGS_BILLING: '/settings/billing',
  SETTINGS_ADVANCED: '/settings/advanced',
AI_ASSISTANT: '/ai-assistant',
  USERS: '/users',

  // Fallback
  NOT_FOUND: '*',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
} as const;

/** Union de toutes les valeurs de `ROUTES`, utile pour typer des props. */
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * `ROUTES.LEAD_DETAILS` est un patron de route (`/leads/:leadId`), pas
 * une URL utilisable telle quelle. Cette fonction construit le chemin
 * réel — à utiliser partout où on navigue vers la fiche d'un lead
 * (`LeadRow`, `LeadCard`, `LeadActions`…) plutôt que de concaténer des
 * chaînes à la main.
 */
export function buildLeadDetailsPath(leadId: string): string {
  return `/leads/${leadId}`;
}

export function buildContactDetailsPath(contactId: string): string {
  return `/contacts/${contactId}`;
}

export function buildEditContactPath(contactId: string): string {
  return `/contacts/${contactId}/edit`;
}

export function buildCompanyDetailsPath(companyId: string): string {
  return `/companies/${companyId}`;
}

export function buildEditCompanyPath(companyId: string): string {
  return `/companies/${companyId}/edit`;
}

export function buildOpportunityDetailsPath(opportunityId: string): string {
  return `/opportunities/${opportunityId}`;
}

export function buildEditOpportunityPath(opportunityId: string): string {
  return `/opportunities/${opportunityId}/edit`;
}
