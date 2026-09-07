/* ═════════════════════════════════════════════════════════════════════
   Settings — AdvancedSettingsPage
   Modes développeur, debug, fonctionnalités expérimentales, reset.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { SettingsGroup } from '@/features/settings/components/SettingsGroup';
import { DangerZone } from '@/features/settings/components/DangerZone';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';
import { clearAllSettings } from '@/features/settings/utils';
import { defaultAdvancedOptions } from '@/features/settings/mocks';
import type { AdvancedOptions } from '@/features/settings/types';

/* ═══════════════════════════════════════════════════════ */
export function AdvancedSettingsPage() {
  const { success } = useNotifications();
  const [options, setOptions] = useState<AdvancedOptions>(
    defaultAdvancedOptions,
  );
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const toggle = (key: keyof AdvancedOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    success('Advanced option updated.');
  };

  const handleClearData = () => {
    setConfirmClear(false);
    clearAllSettings();
    success('Local data cleared.');
  };

  const handleResetApp = () => {
    setConfirmReset(false);
    clearAllSettings();
    window.location.reload();
  };

  return (
    <div>
      <SettingsHeader
        title="Advanced"
        description="Development options and advanced settings."
      />

      <div className="flex flex-col gap-6">
        <SettingsSection
          title="Development"
          description="Options for development and debugging."
        >
          <SettingsCard>
            <SettingsGroup>
              <SettingsRow
                title="Developer mode"
                description="Enable developer tools and additional debugging information."
              >
                <Switch
                  checked={options.developerMode}
                  onCheckedChange={() => toggle('developerMode')}
                />
              </SettingsRow>
              <SettingsRow
                title="Debug mode"
                description="Log detailed debug information to the console."
              >
                <Switch
                  checked={options.debugMode}
                  onCheckedChange={() => toggle('debugMode')}
                />
              </SettingsRow>
              <SettingsRow
                title="Experimental features"
                description="Enable features that are still in development."
              >
                <Switch
                  checked={options.experimentalFeatures}
                  onCheckedChange={() => toggle('experimentalFeatures')}
                />
              </SettingsRow>
              <SettingsRow
                title="Performance mode"
                description="Reduce visual effects for better performance."
              >
                <Switch
                  checked={options.performanceMode}
                  onCheckedChange={() => toggle('performanceMode')}
                />
              </SettingsRow>
              <SettingsRow
                title="Animations"
                description="Enable UI animations and transitions."
              >
                <Switch
                  checked={options.animations}
                  onCheckedChange={() => toggle('animations')}
                />
              </SettingsRow>
            </SettingsGroup>
          </SettingsCard>
        </SettingsSection>

        <DangerZone
          actions={[
            {
              title: 'Clear local data',
              description:
                'Remove all locally stored preferences and cached data. Your account remains intact.',
              buttonLabel: 'Clear data',
              danger: true,
              onAction: () => setConfirmClear(true),
            },
            {
              title: 'Reset application',
              description:
                'Reset all settings to factory defaults. This action cannot be undone.',
              buttonLabel: 'Reset',
              danger: true,
              onAction: () => setConfirmReset(true),
            },
          ]}
        />
      </div>

      <ConfirmationDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClearData}
        title="Clear local data"
        description="All locally stored preferences and cached data will be removed. You will need to reconfigure your settings."
        confirmLabel="Clear"
        danger
      />

      <ConfirmationDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleResetApp}
        title="Reset application"
        description="All settings will be restored to factory defaults. The page will reload. Continue?"
        confirmLabel="Reset"
        danger
      />
    </div>
  );
}

export default AdvancedSettingsPage;

