/* ═════════════════════════════════════════════════════════════════════
   Settings — DataPrivacySettingsPage
   Vie privée, analytics, tracking, cookies, export, suppression.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Download, Trash2, FileText } from 'lucide-react';
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
import {
  defaultDataPrivacyPreferences,
} from '@/features/settings/mocks';
import type { DataPrivacyPreferences } from '@/features/settings/types';

/* ═══════════════════════════════════════════════════════ */
export function DataPrivacySettingsPage() {
  const { success } = useNotifications();
  const [preferences, setPreferences] = useState<DataPrivacyPreferences>(
    defaultDataPrivacyPreferences,
  );
  const [confirmExport, setConfirmExport] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = (key: keyof DataPrivacyPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    success('Privacy preference updated.');
  };

  const handleExport = () => {
    setConfirmExport(false);
    success('Data export initiated (simulated).');
  };

  const handleDeleteData = () => {
    setConfirmDelete(false);
    success('Data deletion requested (simulated).');
  };

  return (
    <div>
      <SettingsHeader
        title="Data & Privacy"
        description="Manage your data, privacy preferences, and export options."
      />

      <div className="flex flex-col gap-6">
        <SettingsSection
          title="Privacy"
          description="Control how your data is used."
        >
          <SettingsCard>
            <SettingsGroup>
              <SettingsRow
                title="Analytics"
                description="Help us improve LeadPro by sharing anonymous usage data."
              >
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={() => toggle('analytics')}
                />
              </SettingsRow>
              <SettingsRow
                title="Activity tracking"
                description="Track your activity to provide personalized insights."
              >
                <Switch
                  checked={preferences.activityTracking}
                  onCheckedChange={() => toggle('activityTracking')}
                />
              </SettingsRow>
              <SettingsRow
                title="Cookies"
                description="Essential cookies for authentication and security."
              >
                <Switch
                  checked={preferences.cookies}
                  onCheckedChange={() => toggle('cookies')}
                />
              </SettingsRow>
            </SettingsGroup>
          </SettingsCard>
        </SettingsSection>

        <SettingsSection
          title="Data management"
          description="Export or delete your data."
        >
          <SettingsCard>
            <SettingsGroup>
              <SettingsRow
                title="Export my data"
                description="Download all your data in JSON format."
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmExport(true)}
                  leadingIcon={<Download className="h-3.5 w-3.5" />}
                >
                  Export
                </Button>
              </SettingsRow>
              <SettingsRow
                title="Request my data"
                description="Receive a copy of your data by email."
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => success('Data request submitted (simulated).')}
                  leadingIcon={<FileText className="h-3.5 w-3.5" />}
                >
                  Request
                </Button>
              </SettingsRow>
            </SettingsGroup>
          </SettingsCard>
        </SettingsSection>

        <DangerZone
          actions={[
            {
              title: 'Delete my data',
              description:
                'Permanently delete all your personal data from LeadPro.',
              buttonLabel: 'Delete',
              danger: true,
              onAction: () => setConfirmDelete(true),
            },
          ]}
        />
      </div>

      <ConfirmationDialog
        open={confirmExport}
        onClose={() => setConfirmExport(false)}
        onConfirm={handleExport}
        title="Export my data"
        description="A JSON export of your data will be generated. This may take a few minutes."
        confirmLabel="Export"
      />

      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteData}
        title="Delete my data"
        description="This action is irreversible. All your personal data will be permanently deleted."
        confirmLabel="Delete my data"
        danger
      />
    </div>
  );
}

export default DataPrivacySettingsPage;

