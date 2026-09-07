/**
 * Affichage formaté de la valeur monétaire pour le Pipeline Kanban.
 */
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/cn';

interface PipelineValueProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'text-[13px]',
  md: 'text-[14px] font-semibold',
  lg: 'text-[16px] font-bold',
} as const;

export function PipelineValue({ amount, currency = 'MAD', size = 'md', className }: PipelineValueProps) {
  return (
    <span className={cn('tabular-nums text-text-primary', sizeStyles[size], className)}>
      {formatCurrency(amount, currency)}
    </span>
  );
}

