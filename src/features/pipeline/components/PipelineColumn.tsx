/**
 * Colonne Kanban du Pipeline.
 * Affiche les cartes d'une étape avec titre, compteurs et zone de drop.
 */
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import type { PipelineStage } from '@/types/opportunity.types';
import type { Opportunity } from '@/types/opportunity.types';
import { cn } from '@/lib/cn';
import { PipelineCard } from './PipelineCard';
import { PipelineEmptyState } from './PipelineEmptyState';
import { PipelineValue } from './PipelineValue';
import { formatCurrency } from '@/utils/formatCurrency';

interface PipelineColumnProps {
  id: PipelineStage;
  title: string;
  color: string;
  bgColor: string;
  items: Opportunity[];
  onCardClick?: (opportunity: Opportunity) => void;
  onCardEdit?: (opportunity: Opportunity) => void;
  onCardView?: (opportunity: Opportunity) => void;
  onCardDelete?: (opportunity: Opportunity) => void;
}

const stageColors: Record<PipelineStage, string> = {
  prospecting: 'border-l-neutral-400',
  qualification: 'border-l-info-400',
  proposal: 'border-l-primary-400',
  negotiation: 'border-l-warning-400',
  contract_sent: 'border-l-accent',
  closed_won: 'border-l-success-500',
  closed_lost: 'border-l-danger-400',
};

export function PipelineColumn({
  id,
  title,
  color,
  bgColor,
  items,
  onCardClick,
  onCardEdit,
  onCardView,
  onCardDelete,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const totalValue = items.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col w-[280px] laptop:w-[300px]',
        'rounded-xl border border-border bg-surface',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3 border-b border-border rounded-t-xl',
          bgColor,
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className={cn('text-[11px] font-bold uppercase tracking-wider', color)}>
            {title}
          </span>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-background-tertiary px-1.5 text-[11px] font-medium tabular-nums text-text-secondary">
            {items.length}
          </span>
        </div>
        <span className="text-[11px] tabular-nums text-text-tertiary font-medium">
          {formatCurrency(totalValue, 'MAD')}
        </span>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2 p-2.5 min-h-[120px] transition-all duration-150',
          'overflow-y-auto max-h-[calc(100vh-320px)]',
          isOver && 'bg-accent-subtle/50 rounded-b-xl',
        )}
      >
        <SortableContext items={items.map((o) => o.id)} strategy={verticalListSortingStrategy}>
          {items.length > 0 ? (
            items.map((opportunity) => (
              <motion.div
                key={opportunity.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              >
                <PipelineCard
                  opportunity={opportunity}
                  onClick={() => onCardClick?.(opportunity)}
                  onEdit={() => onCardEdit?.(opportunity)}
                  onView={() => onCardView?.(opportunity)}
                  onDelete={() => onCardDelete?.(opportunity)}
                />
              </motion.div>
            ))
          ) : (
            <PipelineEmptyState />
          )}
        </SortableContext>
      </div>
    </div>
  );
}

