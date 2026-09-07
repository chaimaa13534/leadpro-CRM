import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = memo(function ChartCard({ title, subtitle, badge, children, className }: ChartCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card variant="elevated" padding="md" className={cn('h-full', className)}>
        <CardHeader className="mb-4 flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle ? <p className="mt-1 text-[12px] text-text-tertiary">{subtitle}</p> : null}
          </div>
          {badge ? <Badge variant="info">{badge}</Badge> : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
});
