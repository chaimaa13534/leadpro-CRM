import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, TrendingUp, PieChart, UserCheck, Calendar, Target, Clock, MessageSquare, CheckCircle, BarChart3, Users, AlertCircle, Bell, Handshake, FileText, TrendingDown, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { AIInsight } from '../types/ai.types';

const ICON_MAP: Record<string, typeof AlertTriangle> = {
  alertTriangle: AlertTriangle,
  dollarSign: DollarSign,
  trendUp: TrendingUp,
  trendingUp: TrendingUp,
  pieChart: PieChart,
  userCheck: UserCheck,
  calendar: Calendar,
  target: Target,
  clock: Clock,
  messageSquare: MessageSquare,
  checkCircle: CheckCircle,
  checkCircle2: CheckCircle2,
  barChart3: BarChart3,
  users: Users,
  alertCircle: AlertCircle,
  bell: Bell,
  handshake: Handshake,
  fileText: FileText,
  trendingDown: TrendingDown,
};

const PRIORITY_COLORS: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
};

interface AIInsightCardProps {
  insight: AIInsight;
  index?: number;
  className?: string;
}

export function AIInsightCard({ insight, index = 0, className }: AIInsightCardProps) {
  const Icon = ICON_MAP[insight.icon] ?? AlertTriangle;
  const priorityColor = PRIORITY_COLORS[insight.priority] ?? 'neutral';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Card variant="outlined" padding="md" interactive className={cn('h-full', className)}>
        <CardContent className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
            <Icon className="h-4 w-4" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-[13px] font-semibold text-text-primary">{insight.title}</h4>
              <Badge variant={priorityColor} size="sm">
                {insight.priority}
              </Badge>
            </div>
            <p className="text-[12px] text-text-tertiary leading-relaxed mb-2">{insight.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-accent">{insight.action}</span>
              <span className="text-[10px] text-text-disabled">·</span>
              <span className="text-[10px] text-text-disabled capitalize">{insight.category}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
