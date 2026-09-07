/* ═════════════════════════════════════════════════════════════════════
   Settings — BillingSettingsPage
   Plan, usage, historique factures — interface uniquement, aucun paiement.
   ═════════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { SettingsHeader } from '@/features/settings/components/SettingsHeader';
import { BillingOverview } from '@/features/settings/components/BillingOverview';
import { BillingHistory } from '@/features/settings/components/BillingHistory';
import { ConfirmationDialog } from '@/features/settings/components/ConfirmationDialog';
import { DangerZone } from '@/features/settings/components/DangerZone';
import { useNotifications } from '@/hooks/useNotifications';
import {
  currentPlanMock,
  planUsageMock,
  invoicesMock,
  plansMock,
} from '@/features/settings/mocks';
import type { Invoice } from '@/features/settings/types';

/* ═══════════════════════════════════════════════════════ */
export function BillingSettingsPage() {
  const { success } = useNotifications();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [plan, setPlan] = useState(currentPlanMock);

  const handleUpgrade = () => {
    const professional = plansMock.find((p) => p.name === 'Professional');
    if (professional) {
      setPlan(professional);
      success('Upgraded to Professional plan (simulated).');
    }
  };

  const handleCancelPlan = () => {
    setConfirmCancel(false);
    const free = plansMock.find((p) => p.name === 'Free');
    if (free) {
      setPlan(free);
      success('Plan cancelled. You are now on the Free plan.');
    }
  };

  const handleDownload = (invoice: Invoice) => {
    success(`Downloading ${invoice.number} (simulated).`);
  };

  return (
    <div>
      <SettingsHeader
        title="Billing"
        description="Manage your subscription and billing history."
      />

      <div className="flex flex-col gap-6">
        <BillingOverview
          plan={plan}
          usage={planUsageMock}
          onUpgrade={handleUpgrade}
        />

        <BillingHistory invoices={invoicesMock} onDownload={handleDownload} />

        <DangerZone
          actions={[
            {
              title: 'Cancel subscription',
              description:
                'Your plan will be downgraded to Free at the end of the billing period.',
              buttonLabel: 'Cancel plan',
              danger: true,
              onAction: () => setConfirmCancel(true),
            },
          ]}
        />
      </div>

      <ConfirmationDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={handleCancelPlan}
        title="Cancel subscription"
        description="Your plan will be downgraded to Free at the end of the current billing period. Your data will be preserved."
        confirmLabel="Cancel plan"
        danger
      />
    </div>
  );
}

export default BillingSettingsPage;

