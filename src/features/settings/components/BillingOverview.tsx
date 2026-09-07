/* ═════════════════════════════════════════════════════════════════════
   Settings — BillingOverview
   Plan actuel + usage (utilisateurs, contacts, leads, stockage).
   ═════════════════════════════════════════════════════════════════════ */

import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import type { Plan, PlanUsage } from '@/features/settings/types';

interface BillingOverviewProps {
  plan: Plan;
  usage: PlanUsage;
  onUpgrade: () => void;
}

const USAGE_LABELS: Record<keyof PlanUsage, string> = {
  users: 'Users',
  contacts: 'Contacts',
  leads: 'Leads',
  storageGB: 'Storage',
};

const formatLimit = (value: number) =>
  Number.isFinite(value) ? value.toLocaleString('fr-FR') : 'Unlimited';

const usagePercent = (used: number, limit: number) =>
  Number.isFinite(limit) ? Math.min(100, Math.round((used / limit) * 100)) : 0;

/* ═══════════════════════════════════════════════════════ */
export function BillingOverview({ plan, usage, onUpgrade }: BillingOverviewProps) {
  return (
    <SettingsSection
      title="Plan actuel"
      description="Gérez votre abonnement et suivez votre consommation."
    >
      <SettingsCard>
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <Badge variant="primary">Current plan</Badge>
              </div>
              <p className="mt-1 text-[13px] text-text-tertiary">
                {plan.description}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[24px] font-bold tracking-tight text-text-primary">
                  {plan.price === 0 ? '0 €' : `${plan.price} €`}
                </span>
                <span className="text-[12px] text-text-tertiary">
                  / utilisateur / mois
                </span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={onUpgrade}
              className="shrink-0"
            >
              Upgrade plan
            </Button>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[13px] text-text-secondary"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success-500/10 text-success-500">
                  <Check className="h-3 w-3" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-5">
            <p className="mb-4 text-[13px] font-medium text-text-primary">
              Usage
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {(Object.keys(USAGE_LABELS) as (keyof PlanUsage)[]).map((key) => {
                const { used, limit } = usage[key];
                const percent = usagePercent(used, limit);
                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[12px] text-text-secondary">
                        {USAGE_LABELS[key]}
                      </span>
                      <span className="text-[12px] font-medium text-text-primary">
                        {used.toLocaleString('fr-FR')} / {formatLimit(limit)}
                      </span>
                    </div>
                    <Progress value={percent} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}

export default BillingOverview;

