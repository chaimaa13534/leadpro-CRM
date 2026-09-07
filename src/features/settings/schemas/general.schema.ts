/* ═════════════════════════════════════════════════════════════════════
   Settings — General Preferences Schema (Zod)
   ═════════════════════════════════════════════════════════════════════ */

import { z } from 'zod';
import type {
  CurrencyCode,
  DateFormatId,
  DefaultDashboard,
  LanguageCode,
  TimeFormatId,
  WeekStart,
} from '@/features/settings/types';

const languageValues: LanguageCode[] = [
  'fr',
  'en',
  'es',
  'de',
  'pt',
  'it',
  'ar',
  'nl',
];

const dateFormatValues: DateFormatId[] = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY-MM-DD',
];

const timeFormatValues: TimeFormatId[] = ['24h', '12h'];

const currencyValues: CurrencyCode[] = [
  'EUR',
  'USD',
  'MAD',
  'GBP',
  'CAD',
  'CHF',
];

const weekStartValues: WeekStart[] = ['monday', 'sunday', 'saturday'];

const dashboardValues: DefaultDashboard[] = [
  'dashboard',
  'pipeline',
  'leads',
  'calendar',
  'reports',
];

/** Schéma de validation des préférences générales. */
export const generalPreferencesSchema = z.object({
  language: z.enum(languageValues as [LanguageCode, ...LanguageCode[]]),
  timezone: z.string().min(1, 'Le fuseau horaire est requis.'),
  dateFormat: z.enum(dateFormatValues as [DateFormatId, ...DateFormatId[]]),
  timeFormat: z.enum(timeFormatValues as [TimeFormatId, ...TimeFormatId[]]),
  currency: z.enum(currencyValues as [CurrencyCode, ...CurrencyCode[]]),
  firstDayOfWeek: z.enum(weekStartValues as [WeekStart, ...WeekStart[]]),
  defaultDashboard: z.enum(
    dashboardValues as [DefaultDashboard, ...DefaultDashboard[]],
  ),
  defaultPipeline: z.string().min(1, 'Le pipeline par défaut est requis.'),
});

export type GeneralPreferencesFormValues = z.infer<
  typeof generalPreferencesSchema
>;

