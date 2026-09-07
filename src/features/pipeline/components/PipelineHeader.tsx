/**
 * En-tête du Pipeline.
 * Affiche le titre, le pipeline actif, le nombre d'opportunités et la valeur totale.
 * Propose les boutons Nouvelle Opportunité, Filtres, Vue, Export.
 */
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { useNotifications } from '@/hooks/useNotifications';
import type { PipelineStats } from '@/features/pipeline/types/pipeline.types';
import type { PipelineView } from '@/features/pipeline/types/pipeline.types';
import { cn } from '@/lib/cn';

interface PipelineHeaderProps {
  activePipeline: string;
  stats: PipelineStats;
  currentView: PipelineView;
  onViewChange: (view: PipelineView) => void;
  onNewOpportunity?: () => void;
  onExport?: () => void;
  onFiltersToggle?: () => void;
  hasActiveFilters?: boolean;
}

export function PipelineHeader({
  activePipeline,
  stats,
  currentView,
  onViewChange,
  onNewOpportunity,
  onExport,
  onFiltersToggle,
  hasActiveFilters = false,
}: PipelineHeaderProps) {
  const { info } = useNotifications();

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-primary-50/60 to-transparent px-6 py-5 tablet:flex-row tablet:items-center tablet:justify-between dark:from-primary-950/20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-h2 font-semibold tracking-tight text-primary-800 dark:text-primary-300">
            Pipeline
          </h1>
          <span className="text-[12px] text-text-tertiary">·</span>
          <span className="text-[13px] font-medium text-text-secondary">
            {activePipeline}
          </span>
        </div>
        <p className="text-body text-text-secondary">
          <span className="font-medium text-text-primary">
            {stats.totalOpportunities.toLocaleString('fr-FR')}
          </span>{' '}
          opportunités ·{' '}
          <span className="font-medium text-text-primary">
            {formatCurrency(stats.totalValue)}
          </span>{' '}
          valeur totale
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Filtres toggle */}
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<Icons.filter className="size-3.5" />}
          onClick={onFiltersToggle}
          className={cn(hasActiveFilters && 'ring-2 ring-accent/30')}
        >
          Filtres
          {hasActiveFilters && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-text-inverse">
              !
            </span>
          )}
        </Button>

        {/* Vue */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => onViewChange('board')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium transition-colors',
              currentView === 'board'
                ? 'bg-accent text-text-inverse'
                : 'text-text-tertiary hover:bg-surface-hover',
            )}
            aria-label="Vue Board"
          >
            <Icons.columns className="h-3.5 w-3.5" />
            Board
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium transition-colors',
              currentView === 'list'
                ? 'bg-accent text-text-inverse'
                : 'text-text-tertiary hover:bg-surface-hover',
            )}
            aria-label="Vue Liste"
          >
            <Icons.list className="h-3.5 w-3.5" />
            Liste
          </button>
        </div>

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<Icons.export className="size-3.5" />}
          onClick={() => {
            onExport?.();
            info('Export du pipeline démarré.');
          }}
        >
          Exporter
        </Button>

        {/* Nouvelle Opportunité */}
        <Button
          size="sm"
          leadingIcon={<Icons.add className="size-3.5" />}
          onClick={() => {
            onNewOpportunity?.();
            info('Création d\'une nouvelle opportunité.');
          }}
        >
          Nouvelle Opportunité
        </Button>
      </div>
    </div>
  );
}

