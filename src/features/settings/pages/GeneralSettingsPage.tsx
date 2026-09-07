/* ═════════════════════════════════════════════════════════════════════
   Settings — GeneralSettingsPage
   Langue, fuseau horaire, format date/heure, devise, etc.
   React Hook Form + Zod, persisté dans localStorage.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsGroup } from '@/features/settings/components/SettingsGroup';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { zodResolver } from '@/lib/zod-resolver';
import {
  generalPreferencesSchema,
  type GeneralPreferencesFormValues,
} from '@/features/settings/schemas';
import { defaultGeneralPreferences } from '@/features/settings/mocks';
import {
  savePreferences as saveGeneralPreferences,
  getPreferences as getGeneralPreferences,
} from '@/features/settings/utils';

const STORAGE_KEY = 'leadpro-crm:settings:preferences';

const LANGUAGES = [
  { label: 'Français', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Español', value: 'es' },
  { label: 'Italiano', value: 'it' },
  { label: 'Português', value: 'pt' },
] as const;

const TIMEZONES = [
  { label: 'Europe/Paris (UTC+1)', value: 'Europe/Paris' },
  { label: 'Europe/London (UTC+0)', value: 'Europe/London' },
  { label: 'America/New_York (UTC-5)', value: 'America/New_York' },
  { label: 'America/Chicago (UTC-6)', value: 'America/Chicago' },
  { label: 'America/Los_Angeles (UTC-8)', value: 'America/Los_Angeles' },
  { label: 'Asia/Tokyo (UTC+9)', value: 'Asia/Tokyo' },
  { label: 'Asia/Shanghai (UTC+8)', value: 'Asia/Shanghai' },
  { label: 'Australia/Sydney (UTC+11)', value: 'Australia/Sydney' },
] as const;

const DATE_FORMATS = [
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
] as const;

const TIME_FORMATS = [
  { label: '24h', value: '24h' },
  { label: '12h (AM/PM)', value: '12h' },
] as const;

const CURRENCIES = [
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'JPY (¥)', value: 'JPY' },
] as const;

const DAY_OPTIONS = [
  { label: 'Monday', value: 'monday' },
  { label: 'Sunday', value: 'sunday' },
  { label: 'Saturday', value: 'saturday' },
] as const;

const DASHBOARDS = [
  { label: 'Main Dashboard', value: 'main' },
  { label: 'Pipeline', value: 'pipeline' },
  { label: 'Reports', value: 'reports' },
] as const;

const PIPELINES = [
  { label: 'Default Pipeline', value: 'default' },
  { label: 'Sales Pipeline', value: 'sales' },
  { label: 'Marketing Pipeline', value: 'marketing' },
] as const;

/* ═══════════════════════════════════════════════════════ */
export function GeneralSettingsPage() {
  const navigate = useNavigate();
  const { success } = useNotifications();
  const [hasChanges, setHasChanges] = useState(false);

  const stored = getGeneralPreferences();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<GeneralPreferencesFormValues>({
    resolver: zodResolver(generalPreferencesSchema),
    defaultValues: stored ?? defaultGeneralPreferences,
  });

  const onSubmit = async (values: GeneralPreferencesFormValues) => {
    saveGeneralPreferences(values);
    setHasChanges(false);
    success('General settings saved.');
  };

  const handleReset = () => {
    reset(defaultGeneralPreferences);
    saveGeneralPreferences(defaultGeneralPreferences);
    setHasChanges(false);
    success('Settings reset to defaults.');
  };

  const handleChange = () => {
    if (!hasChanges) setHasChanges(true);
  };

  return (
    <div>
      <SettingsHeader
        title="General"
        description="Configure your language, timezone, and regional preferences."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={handleChange}
        className="flex flex-col gap-6"
      >
        <SettingsSection title="Regional settings">
          <SettingsCard>
            <SettingsGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Language"
                  options={[...LANGUAGES]}
                  error={errors.language?.message}
                  {...register('language')}
                />
                <Select
                  label="Timezone"
                  options={[...TIMEZONES]}
                  error={errors.timezone?.message}
                  {...register('timezone')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Date format"
                  options={[...DATE_FORMATS]}
                  error={errors.dateFormat?.message}
                  {...register('dateFormat')}
                />
                <Select
                  label="Time format"
                  options={[...TIME_FORMATS]}
                  error={errors.timeFormat?.message}
                  {...register('timeFormat')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Currency"
                  options={[...CURRENCIES]}
                  error={errors.currency?.message}
                  {...register('currency')}
                />
                <Select
                  label="First day of week"
                  options={[...DAY_OPTIONS]}
                  error={errors.firstDayOfWeek?.message}
                  {...register('firstDayOfWeek')}
                />
              </div>
            </SettingsGroup>
          </SettingsCard>
        </SettingsSection>

        <SettingsSection title="Defaults">
          <SettingsCard>
            <SettingsGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Default dashboard"
                  options={[...DASHBOARDS]}
                  error={errors.defaultDashboard?.message}
                  {...register('defaultDashboard')}
                />
                <Select
                  label="Default pipeline"
                  options={[...PIPELINES]}
                  error={errors.defaultPipeline?.message}
                  {...register('defaultPipeline')}
                />
              </div>
            </SettingsGroup>
          </SettingsCard>
        </SettingsSection>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            leadingIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Reset
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!isDirty && !hasChanges}
            leadingIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default GeneralSettingsPage;

