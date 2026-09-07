import { motion } from 'framer-motion';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  PIPELINE_STAGE_ORDER,
  PIPELINE_STAGES,
} from '@/lib/constants/pipeline.constants';
import { opportunitiesDistributionMock } from '@/mocks/analytics.mock';
import { formatCurrency } from '@/utils/formatCurrency';

const maxCount = Math.max(
  ...opportunitiesDistributionMock.map((entry) => entry.opportunityCount),
);

/**
 * Vue résumée du pipeline : une ligne par étape avec nombre
 * d'opportunités, valeur et une barre de progression relative au volume
 * de l'étape la plus chargée. Pas de glisser-déposer ni de cartes
 * détaillées — le Kanban complet viendra plus tard.
 */
export function PipelineSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d'ensemble du pipeline</CardTitle>
        <CardDescription>Opportunités par étape</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-4 px-6 pb-6">
        {PIPELINE_STAGE_ORDER.map((stage, index) => {
          const entry = opportunitiesDistributionMock.find(
            (item) => item.stage === stage,
          );
          const count = entry?.opportunityCount ?? 0;
          const totalValue = entry?.totalValue ?? 0;
          const widthPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const meta = PIPELINE_STAGES[stage];

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              className="flex items-center gap-3"
            >
              <span className="w-28 shrink-0 text-body text-text-secondary">
                {meta.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-300 ease-standard"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-body font-medium text-text-primary">
                {count}
              </span>
              <span className="text-figure w-24 shrink-0 text-right text-caption text-text-secondary">
                {formatCurrency(totalValue)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
