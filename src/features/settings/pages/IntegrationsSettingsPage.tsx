/* ═════════════════════════════════════════════════════════════════════
   Settings — IntegrationsSettingsPage
   Grille de cartes d’intégration (connexion/déconnexion simulée).
   ═════════════════════════════════════════════════════════════════════ */

import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { IntegrationCard } from '@/features/settings/components/IntegrationCard';
import { useNotifications } from '@/hooks/useNotifications';
import { integrationsMock } from '@/features/settings/mocks';
import { SettingsEmptyState } from '@/features/settings/components/SettingsEmptyState';

/* ═══════════════════════════════════════════════════════ */
export function IntegrationsSettingsPage() {
  const { success } = useNotifications();

  if (integrationsMock.length === 0) {
    return (
      <div>
        <SettingsHeader title="Integrations" description="Connect your favorite tools." />
        <SettingsEmptyState title="No integrations available" />
      </div>
    );
  }

  const handleConnect = async (id: string) => {
    success(`Integration connected (simulated).`);
  };

  const handleDisconnect = async (id: string) => {
    success(`Integration disconnected (simulated).`);
  };

  return (
    <div>
      <SettingsHeader
        title="Integrations"
        description="Connect your favorite tools to LeadPro."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrationsMock.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>
    </div>
  );
}

export default IntegrationsSettingsPage;

