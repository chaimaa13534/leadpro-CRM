import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

export interface KPICardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  change?: number;
  description: string;
}


export function KPICard({
  icon: Icon,
  label,
  value,
  change,
  description,
}: KPICardProps) {
  const isPositive = (change ?? 0) >= 0;
  const TrendIcon = isPositive ? Icons.trendUp : Icons.trendDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="h-full"
    >
      <Card interactive className="h-full">
        <CardContent className="flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-full bg-accent-subtle text-accent">
              {Icon ? <Icon className="size-[16px]" aria-hidden="true" /> : null}
            </span>
            {change !== undefined ? (
              <span
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-medium',
                  isPositive
                    ? 'bg-success-50 text-success-400'
                    : 'bg-danger-50 text-danger-400',
                )}
              >
                <TrendIcon className="size-3" aria-hidden="true" />
                {Math.abs(change).toFixed(1)}%
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-caption font-medium tracking-wide text-text-secondary uppercase">
              {label}
            </p>
            <div className="text-figure text-h2 text-text-primary leading-none">
              {value}
            </div>
          </div>

          <p className="text-caption text-text-secondary/70">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
