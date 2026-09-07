/**
 * Badge de priorité / probabilité pour le Pipeline Kanban.
 * Composant réutilisable, adapté au Design System.
 */
import { Badge } from '@/components/ui/Badge';
import type { OpportunityPriority } from '@/types/opportunity.types';

interface PipelineBadgeProps {
  type: 'priority' | 'probability';
  value: OpportunityPriority | number;
}

const priorityConfig: Record<OpportunityPriority, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  low: { variant: 'success', label: 'Low' },
  medium: { variant: 'info', label: 'Medium' },
  high: { variant: 'warning', label: 'High' },
  critical: { variant: 'danger', label: 'Critical' },
};

export function PipelineBadge({ type, value }: PipelineBadgeProps) {
  if (type === 'priority') {
    const config = priorityConfig[value as OpportunityPriority];
    if (!config) return null;
    return (
      <Badge variant={config.variant} size="sm" dot>
        {config.label}
      </Badge>
    );
  }

  const prob = value as number;
  const variant = prob >= 80 ? 'success' : prob >= 50 ? 'warning' : prob >= 25 ? 'info' : 'neutral';
  return (
    <Badge variant={variant} size="sm">
      {prob}%
    </Badge>
  );
}

