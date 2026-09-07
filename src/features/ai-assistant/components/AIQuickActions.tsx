import { motion } from 'framer-motion';
import { BarChart3, Target, TrendingUp, AlertTriangle, Mail, Lightbulb, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';
import { cn } from '@/lib/cn';
import type { AIQuickAction } from '../types/ai.types';

const ICON_MAP: Record<string, LucideIcon> = {
  barChart3: BarChart3,
  target: Target,
  trendingUp: TrendingUp,
  alertTriangle: AlertTriangle,
  mail: Mail,
  lightbulb: Lightbulb,
};

interface AIQuickActionsProps {
  actions: AIQuickAction[];
  onSelect: (action: string) => void;
  className?: string;
}

export function AIQuickActions({ actions, onSelect, className }: AIQuickActionsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('grid gap-2 sm:grid-cols-2 lg:grid-cols-3', className)}
    >
      {actions.map((action) => {
        const Icon = ICON_MAP[action.icon] ?? Lightbulb;
        return (
          <motion.div key={action.id} variants={staggerItem}>
            <Card
              variant="outlined"
              padding="md"
              interactive
              onClick={() => onSelect(action.action)}
              className="h-full"
            >
              <CardContent className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">{action.label}</p>
                  <p className="text-[11px] text-text-tertiary truncate">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
