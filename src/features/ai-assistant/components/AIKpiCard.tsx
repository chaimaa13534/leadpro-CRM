import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import type { AIKpiData } from '../types/ai.types';

interface AIKpiCardProps {
  data: AIKpiData;
  index?: number;
  className?: string;
}

export function AIKpiCard({ data, index = 0, className }: AIKpiCardProps) {
  const isPositive = (data.change ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Card variant="outlined" padding="md" className={cn('h-full', className)}>
        <CardContent className="flex flex-col gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">{data.label}</p>
          <div className="flex items-end justify-between">
            <span className="text-[22px] font-semibold text-text-primary leading-none tabular-nums">{data.value}</span>
            {data.change !== undefined && (
              <span
                className={cn(
                  'flex items-center gap-0.5 text-[12px] font-medium tabular-nums',
                  isPositive ? 'text-success-400' : 'text-danger-400',
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {Math.abs(data.change).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-tertiary">{data.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
