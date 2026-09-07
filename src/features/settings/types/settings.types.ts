/* ═════════════════════════════════════════════════════════════════════
   Settings & Administration — Types
   ═════════════════════════════════════════════════════════════════════ */

import type { ID, ISODateString } from '@/types/common.types';
import type { UserRole } from '@/types/user.types';

/**
 * Rôle d’un membre d’équipe. Étend `UserRole` avec le rôle Marketing,
 * présent dans l’espace Settings alors qu’il n’existe pas dans les rôles
 * applicatifs globaux (Jour 2).
 */
export type TeamRole = UserRole | 'marketing';

/* ── General preferences ── */

export type LanguageCode =
  | 'fr'
  | 'en'
  | 'es'
  | 'de'
  | 'pt'
  | 'it'
  | 'ar'
  | 'nl';

export type TimezoneId = string;

export type DateFormatId = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

export type TimeFormatId = '24h' | '12h';

export type CurrencyCode = 'EUR' | 'USD' | 'MAD' | 'GBP' | 'CAD' | 'CHF';

export type WeekStart = 'monday' | 'sunday' | 'saturday';

export type DefaultDashboard =
  | 'dashboard'
  | 'pipeline'
  | 'leads'
  | 'calendar'
  | 'reports';

export interface GeneralPreferences {
  language: LanguageCode;
  timezone: TimezoneId;
  dateFormat: DateFormatId;
  timeFormat: TimeFormatId;
  currency: CurrencyCode;
  firstDayOfWeek: WeekStart;
  defaultDashboard: DefaultDashboard;
  defaultPipeline: string;
}

/* ── Profile ── */

export interface UserProfile {
  id: ID;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  location?: string;
  website?: string;
  updatedAt: ISODateString;
}

/* ── Account ── */

export type AccountStatus = 'active' | 'pending' | 'suspended' | 'deactivated';

export interface AccountInfo {
  id: ID;
  email: string;
  username: string;
  status: AccountStatus;
  createdAt: ISODateString;
  lastLoginAt: ISODateString;
}

/* ── Organization ── */

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';

export interface Organization {
  id: ID;
  logoUrl?: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  companySize: CompanySize;
  taxId?: string;
  description?: string;
  updatedAt: ISODateString;
}

/* ── Appearance ── */

export type ThemeMode = 'light' | 'dark' | 'system';

export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export type SidebarState = 'expanded' | 'collapsed';

export type AnimationPreference = 'enabled' | 'reduced';

export interface AppearancePreferences {
  theme: ThemeMode;
  density: DensityMode;
  sidebar: SidebarState;
  animations: AnimationPreference;
}

/* ── Notifications ── */

export type NotificationChannel = 'email' | 'desktop' | 'push';

export type NotificationCategory =
  | 'crm'
  | 'ai'
  | 'security'
  | 'marketing';

export interface CategoryPreferences {
  leads: boolean;
  contacts: boolean;
  companies: boolean;
  opportunities: boolean;
  pipeline: boolean;
  calendar: boolean;
  tasks: boolean;
  reports: boolean;
}

export interface AIPreferences {
  assistant: boolean;
  recommendations: boolean;
  insights: boolean;
}

export interface SecurityPreferences {
  loginAlerts: boolean;
  securityAlerts: boolean;
}

export interface MarketingPreferences {
  productUpdates: boolean;
  marketingEmails: boolean;
}

export interface NotificationPreferences {
  email: CategoryPreferences & AIPreferences & SecurityPreferences & MarketingPreferences;
  desktop: CategoryPreferences & AIPreferences & SecurityPreferences;
  push: CategoryPreferences & AIPreferences;
}

/* ── Security ── */

export interface SessionDevice {
  id: ID;
  device: string;
  browser: string;
  operatingSystem: string;
  location: string;
  ipAddress: string;
  lastActiveAt: ISODateString;
  isCurrent: boolean;
}

export type SecurityActivityType =
  | 'login'
  | 'password_change'
  | 'two_factor_enabled'
  | 'two_factor_disabled'
  | 'session_revoked'
  | 'security_alert'
  | 'email_changed'
  | 'account_deactivated';

export interface SecurityActivityEvent {
  id: ID;
  type: SecurityActivityType;
  title: string;
  description: string;
  location?: string;
  device?: string;
  occurredAt: ISODateString;
}

export type TwoFactorMethod = 'app' | 'email';

export interface TwoFactorStatus {
  enabled: boolean;
  method?: TwoFactorMethod;
  verifiedAt?: ISODateString;
  recoveryCodesCount: number;
}

/* ── Team ── */

export type TeamMemberStatus = 'active' | 'invited' | 'suspended';

export interface TeamMember {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role: TeamRole;
  department: string;
  status: TeamMemberStatus;
  lastActiveAt?: ISODateString;
  invitedAt: ISODateString;
}

export interface InviteMemberInput {
  firstName: string;
  lastName: string;
  email: string;
  role: TeamRole;
  department: string;
  message?: string;
}

/* ── Roles & Permissions ── */

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export';

export type PermissionModule =
  | 'dashboard'
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'opportunities'
  | 'pipeline'
  | 'calendar'
  | 'tasks'
  | 'reports'
  | 'notifications'
  | 'ai_assistant'
  | 'settings';

export type PermissionMap = Record<PermissionModule, Record<PermissionAction, boolean>>;

export interface RoleDefinition {
  id: string;
  key: string;
  label: string;
  description: string;
  color: 'accent' | 'success' | 'warning' | 'danger' | 'info';
  permissions: PermissionMap;
}

/* ── Integrations ── */

export type IntegrationStatus = 'connected' | 'available' | 'coming_soon';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'calendar' | 'email' | 'communication' | 'automation' | 'payments';
  status: IntegrationStatus;
  connectedAt?: ISODateString;
  color: string;
}

/* ── Billing ── */

export type PlanId = 'free' | 'professional' | 'enterprise';

export type BillingPeriod = 'monthly' | 'yearly';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  period: BillingPeriod;
  description: string;
  features: string[];
  limits: {
    users: number;
    contacts: number;
    leads: number;
    storageGB: number;
  };
}

export interface PlanUsage {
  users: { used: number; limit: number };
  contacts: { used: number; limit: number };
  leads: { used: number; limit: number };
  storageGB: { used: number; limit: number };
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  number: string;
  date: ISODateString;
  amount: number;
  currency: CurrencyCode;
  status: InvoiceStatus;
  description: string;
}

/* ── Advanced ── */

export interface AdvancedOptions {
  developerMode: boolean;
  debugMode: boolean;
  experimentalFeatures: boolean;
  performanceMode: boolean;
  animations: boolean;
}

/* ── Data & Privacy ── */

export interface DataPrivacyPreferences {
  analytics: boolean;
  activityTracking: boolean;
  cookies: boolean;
}

