/**
 * Panneau de statistiques avancées du Pipeline.
 * Affiche la répartition par étape avec mini graphiques (progress bars).
 */
import type { PipelineStats as PipelineStatsType } from '@/features/pipeline/types/pipeline.types';
import { formatCurrency } from '@/utils/formatCurrency';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/cn';

interface PipelineStatsProps {
  stats: PipelineStatsType;
}

const stageConfig: Record<string, { color: string; label: string }> = {
  prospecting: { color: 'bg-neutral-400', label: 'Lead' },
  qualification: { color: 'bg-info-500', label: 'Qualified' },
  proposal: { color: 'bg-primary-500', label: 'Proposal' },
  negotiation: { color: 'bg-warning-500', label: 'Negotiation' },
  contract_sent: { color: 'bg-accent', label: 'Contract Sent' },
  closed_won: { color: 'bg-success-500', label: 'Won' },
  closed_lost: { color: 'bg-danger-500', label: 'Lost' },
};

export function PipelineStats({ stats }: PipelineStatsProps) {
  const maxCount = Math.max(...stats.stageDistribution.map((s) => s.count), 1);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-[14px] font-semibold text-text-primary mb-4">
        Répartition par étape
      </h3>

      <div className="space-y-4">
        {stats.stageDistribution.map((stage) => {
          const config = stageConfig[stage.stage];
          return (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full shrink-0', config?.color ?? 'bg-neutral-400')} />
                  <span className="text-[12px] font-medium text-text-primary">
                    {config?.label ?? stage.stage}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold tabular-nums text-text-primary">
                    {stage.count}
                  </span>
                  <span className="text-[11px] text-text-tertiary tabular-nums w-[80px] text-right">
                    {formatCurrency(stage.value)}
                  </span>
                  <span className="text-[11px] text-text-tertiary tabular-nums w-[40px] text-right">
                    {stage.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress
                value={stage.count}
                max={maxCount}
                size="sm"
                variant={
                  stage.stage === 'closed_won' ? 'success' :
                  stage.stage === 'closed_lost' ? 'danger' :
                  stage.stage === 'contract_sent' ? 'accent' :
                  'default'
                }
              />
            </div>
          );
        })}
      </div>

      {/* Résumé */}
      <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
            Taux de conversion
          </p>
          <p className="text-[18px] font-bold tabular-nums text-text-primary mt-1">
            {stats.conversionRate.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
            Forecast Revenue
          </p>
          <p className="text-[18px] font-bold tabular-nums text-text-primary mt-1">
            {formatCurrency(stats.forecastRevenue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
            Won Deals
          </p>
          <p className="text-[18px] font-bold tabular-nums text-success-500 mt-1">
            {stats.wonDeals} ({formatCurrency(stats.wonValue)})
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
            Lost Deals
          </p>
          <p className="text-[18px] font-bold tabular-nums text-danger-500 mt-1">
            {stats.lostDeals} ({formatCurrency(stats.lostValue)})
          </p>
        </div>
      </div>
    </div>
  );
}

