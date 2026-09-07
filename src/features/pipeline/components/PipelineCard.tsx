/**
 * Carte Kanban premium pour le Pipeline.
 * Affiche toutes les informations clés d'une opportunité.
 * Utilise React.memo pour les performances.
 */
import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Opportunity } from '@/types/opportunity.types';
import { cn } from '@/lib/cn';
import { formatDate } from '@/utils/formatDate';
import { PipelineBadge } from './PipelineBadge';
import { PipelineAvatarGroup } from './PipelineAvatarGroup';
import { PipelineValue } from './PipelineValue';
import { PipelineActions } from './PipelineActions';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/icons';

interface PipelineCardProps {
  opportunity: Opportunity;
  onClick?: () => void;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
}

export const PipelineCard = memo(function PipelineCard({
  opportunity,
  onClick,
  onEdit,
  onView,
  onDelete,
}: PipelineCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.id,
    data: { type: 'opportunity', opportunity },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const isOverdue = opportunity.expectedCloseDate
    ? new Date(opportunity.expectedCloseDate) < new Date() && opportunity.stage !== 'closed_won'
    : false;

  const daysUntilClose = opportunity.expectedCloseDate
    ? Math.ceil((new Date(opportunity.expectedCloseDate).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className={cn(
        'group relative rounded-lg border border-border bg-surface p-3.5 cursor-pointer',
        'hover:border-border-hover hover:shadow-sm',
        'transition-all duration-150 select-none',
        isDragging && 'shadow-lg ring-2 ring-accent/20 z-50',
        isOverdue && 'border-l-2 border-l-danger-400',
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${opportunity.name} - ${opportunity.companyName}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Drag handle + Actions */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <button
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 -ml-1 items-center justify-center rounded text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-surface-hover hover:text-text-secondary transition-all duration-150 cursor-grab active:cursor-grabbing"
          aria-label="Déplacer la carte"
          tabIndex={-1}
        >
          <Icons.gripVertical className="h-3.5 w-3.5" />
        </button>

        <PipelineActions onEdit={onEdit} onView={onView} onDelete={onDelete} />
      </div>

      {/* Name & Company */}
      <div className="mb-3">
        <h4 className="text-[13px] font-semibold text-text-primary leading-snug mb-0.5 line-clamp-2">
          {opportunity.name}
        </h4>
        {opportunity.companyName && (
          <p className="text-[11px] text-text-tertiary truncate">
            {opportunity.companyName}
          </p>
        )}
      </div>

      {/* Probability bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Probabilité
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-text-secondary">
            {opportunity.probability}%
          </span>
        </div>
        <Progress value={opportunity.probability} size="sm" variant="accent" />
      </div>

      {/* Value & Badges */}
      <div className="flex items-center justify-between mb-2.5">
        <PipelineValue amount={opportunity.amount} currency={opportunity.currency} size="md" />
        <PipelineBadge type="priority" value={opportunity.priority} />
      </div>

      {/* Tags */}
      {opportunity.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {opportunity.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">
              {tag}
            </Badge>
          ))}
          {opportunity.tags.length > 3 && (
            <Badge variant="default" size="sm">
              +{opportunity.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Bottom row: Contact, Due date */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <PipelineAvatarGroup name={opportunity.contactName ?? 'Non assigné'} size="xs" />
        <div className="flex items-center gap-1.5 text-text-tertiary">
          {daysUntilClose !== null && daysUntilClose > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <Icons.clock className="h-3 w-3" />
              <span className={cn(isOverdue && 'text-danger-500 font-medium')}>
                {daysUntilClose <= 7 ? `${daysUntilClose}j` : formatDate(opportunity.expectedCloseDate!, 'short')}
              </span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

