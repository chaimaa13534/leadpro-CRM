/* ═════════════════════════════════════════════════════════════════════
   Settings — NotificationPreferences
   Préférences de notifications par canal (Email / Desktop / Push).
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Mail, Monitor, Smartphone } from 'lucide-react';
import type { NotificationPreferences } from '@/features/settings/types';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsGroup } from '@/features/settings/components/SettingsGroup';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { SettingsSaveBar } from '@/features/settings/components/SettingsSaveBar';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/cn';

interface NotificationPreferencesProps {
  preferences: NotificationPreferences;
  saving?: boolean;
  onSave: (preferences: NotificationPreferences) => Promise<void> | void;
}

const CHANNELS = [
  { id: 'email' as const, label: 'Email', icon: Mail },
  { id: 'desktop' as const, label: 'Desktop', icon: Monitor },
  { id: 'push' as const, label: 'Push', icon: Smartphone },
];

const CHANNEL_GROUPS: {
  channel: 'email' | 'desktop' | 'push';
  rows: { key: string; label: string; description: string }[];
}[] = [
  {
    channel: 'email',
    rows: [
      { key: 'leads', label: 'Leads', description: 'Nouveaux leads et changements de statut' },
      { key: 'contacts', label: 'Contacts', description: 'Activité des contacts' },
      { key: 'companies', label: 'Companies', description: 'Mises à jour des entreprises' },
      { key: 'opportunities', label: 'Opportunities', description: 'Nouvelles opportunités et mises à jour' },
      { key: 'pipeline', label: 'Pipeline', description: 'Mouvements de pipeline' },
      { key: 'calendar', label: 'Calendar', description: 'Rappels et événements' },
      { key: 'tasks', label: 'Tasks', description: 'Échéances et affectations' },
      { key: 'reports', label: 'Reports', description: 'Rapports programmés' },
      { key: 'assistant', label: 'AI Assistant', description: 'Conversations avec l’assistant' },
      { key: 'recommendations', label: 'AI Recommendations', description: 'Suggestions de l’IA' },
      { key: 'insights', label: 'AI Insights', description: 'Analyses générées par l’IA' },
      { key: 'loginAlerts', label: 'Login alerts', description: 'Connexions à votre compte' },
      { key: 'securityAlerts', label: 'Security alerts', description: 'Alertes de sécurité' },
      { key: 'productUpdates', label: 'Product updates', description: 'Nouveautés produit' },
      { key: 'marketingEmails', label: 'Marketing emails', description: 'Emails marketing' },
    ],
  },
  {
    channel: 'desktop',
    rows: [
      { key: 'leads', label: 'Leads', description: 'Nouveaux leads et changements de statut' },
      { key: 'contacts', label: 'Contacts', description: 'Activité des contacts' },
      { key: 'companies', label: 'Companies', description: 'Mises à jour des entreprises' },
      { key: 'opportunities', label: 'Opportunities', description: 'Nouvelles opportunités et mises à jour' },
      { key: 'pipeline', label: 'Pipeline', description: 'Mouvements de pipeline' },
      { key: 'calendar', label: 'Calendar', description: 'Rappels et événements' },
      { key: 'tasks', label: 'Tasks', description: 'Échéances et affectations' },
      { key: 'reports', label: 'Reports', description: 'Rapports programmés' },
      { key: 'assistant', label: 'AI Assistant', description: 'Conversations avec l’assistant' },
      { key: 'recommendations', label: 'AI Recommendations', description: 'Suggestions de l’IA' },
      { key: 'insights', label: 'AI Insights', description: 'Analyses générées par l’IA' },
      { key: 'loginAlerts', label: 'Login alerts', description: 'Connexions à votre compte' },
      { key: 'securityAlerts', label: 'Security alerts', description: 'Alertes de sécurité' },
    ],
  },
  {
    channel: 'push',
    rows: [
      { key: 'leads', label: 'Leads', description: 'Nouveaux leads et changements de statut' },
      { key: 'contacts', label: 'Contacts', description: 'Activité des contacts' },
      { key: 'companies', label: 'Companies', description: 'Mises à jour des entreprises' },
      { key: 'opportunities', label: 'Opportunities', description: 'Nouvelles opportunités et mises à jour' },
      { key: 'pipeline', label: 'Pipeline', description: 'Mouvements de pipeline' },
      { key: 'calendar', label: 'Calendar', description: 'Rappels et événements' },
      { key: 'tasks', label: 'Tasks', description: 'Échéances et affectations' },
      { key: 'reports', label: 'Reports', description: 'Rapports programmés' },
      { key: 'assistant', label: 'AI Assistant', description: 'Conversations avec l’assistant' },
      { key: 'recommendations', label: 'AI Recommendations', description: 'Suggestions de l’IA' },
      { key: 'insights', label: 'AI Insights', description: 'Analyses générées par l’IA' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════ */
export function NotificationPreferences({
  preferences,
  saving = false,
  onSave,
}: NotificationPreferencesProps) {
  const [draft, setDraft] = useState<NotificationPreferences>(preferences);
  const [saved, setSaved] = useState(false);

  const handleToggle = (
    channel: keyof NotificationPreferences,
    key: string,
  ) => {
    setDraft((prev) => {
      const channelValue = {
        ...(prev[channel] as unknown as Record<string, boolean>),
      };
      channelValue[key] = !channelValue[key];
      return {
        ...prev,
        [channel]: channelValue,
      } as NotificationPreferences;
    });
  };

  const handleSave = async () => {
    await onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isDirty = JSON.stringify(draft) !== JSON.stringify(preferences);

  return (
    <div className="flex flex-col gap-6">
      {CHANNEL_GROUPS.map(({ channel, rows }) => {
        const channelConfig = CHANNELS.find((c) => c.id === channel)!;
        const Icon = channelConfig.icon;
        return (
          <SettingsSection
            key={channel}
            title={
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent" />
                {channelConfig.label}
              </span>
            }
            description={`Préférences de notifications par ${channelConfig.label.toLowerCase()}.`}
          >
            <SettingsCard>
              <SettingsGroup>
                {rows.map((row) => {
                  const value = (
                    draft[channel] as unknown as Record<string, boolean>
                  )[row.key];
                  return (
                    <SettingsRow
                      key={row.key}
                      title={row.label}
                      description={row.description}
                    >
                      <div className={cn('flex items-center')}>
                        <Checkbox
                          checked={!!value}
                          onChange={() => handleToggle(channel, row.key)}
                          label=""
                          aria-label={`${row.label} — ${channelConfig.label}`}
                        />
                      </div>
                    </SettingsRow>
                  );
                })}
              </SettingsGroup>
            </SettingsCard>
          </SettingsSection>
        );
      })}

      <SettingsSaveBar
        onSave={handleSave}
        onCancel={() => setDraft(preferences)}
        saving={saving}
        saved={saved}
        dirty={isDirty}
      />
    </div>
  );
}

export default NotificationPreferences;

