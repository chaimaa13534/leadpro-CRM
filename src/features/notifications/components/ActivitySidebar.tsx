/* ═════════════════════════════════════════════════════════════════════
   Activity Center — ActivitySidebar
   Summary sidebar with stats and module breakdown
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { History, Activity, CalendarDays, Target, Users, Building2, GitBranch, ListTodo, BarChart3, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/cn';
import type { ActivityStats } from '@/features/notifications/types/notifications.types';

interface ActivitySidebarProps {
  stats: ActivityStats;
}

const moduleIcons: Record<string, typeof Activity> = {
  leads: Target,
  contacts: Users,
  companies: Building2,
  opportunities: GitBranch,
  pipeline: GitBranch,
  tasks: ListTodo,
  meetings: CalendarDays,
  reports: BarChart3,
  communications: MessageSquare,
};

const maxModuleCount = (byModule: Record<string, number>): number => {
  return Math.max(1, ...Object.values(byModule));
};

export const ActivitySidebar = memo(function ActivitySidebar({
  stats,
}: ActivitySidebarProps) {
  const maxVal = maxModuleCount(stats.byModule);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
      className="w-72 shrink-0 space-y-4"
      role="complementary"
      aria-label="Résumé des activités"
    >
      {/* ── Quick stats ── */}
      <Card variant="outlined">
        <CardContent className="p-5">
          <CardHeader className="mb-4">
            <CardTitle className="flex items-center gap-2 text-[13px]">
              <Activity className="size-4 text-accent" />
              Aperçu
            </CardTitle>
          </CardHeader>

          <div className="space-y-3">
            <StatRow label="Total" value={stats.total} color="text-accent" />
            <StatRow label="Aujourd'hui" value={stats.today} color="text-success-400" />
            <StatRow label="Cette semaine" value={stats.thisWeek} color="text-warning-400" />
            <StatRow label="Ce mois" value={stats.thisMonth} color="text-info-400" />
          </div>
        </CardContent>
      </Card>

      {/* ── Module breakdown ── */}
      <Card variant="outlined">
        <CardContent className="p-5">
          <CardHeader className="mb-4">
            <CardTitle className="flex items-center gap-2 text-[13px]">
              <BarChart3 className="size-4 text-accent" />
              Activités par module
            </CardTitle>
            <CardDescription className="text-[11px]">
              Répartition des activités CRM
            </CardDescription>
          </CardHeader>

          <div className="space-y-3">
            {Object.entries(stats.byModule).map(([module, count]) => {
              const Icon = moduleIcons[module] ?? Activity;
              const percentage = Math.round((count / maxVal) * 100);
              return (
                <div key={module} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="size-3.5 text-text-tertiary" />
                      <span className="text-[12px] font-medium text-text-secondary capitalize">
                        {module}
                      </span>
                    </div>
                    <span className="text-[12px] font-semibold tabular-nums text-text-primary">
                      {count}
                    </span>
                  </div>
                  <Progress value={percentage} size="sm" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.aside>
  );
});

/* ── Stat row ── */
function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-text-tertiary">{label}</span>
      <span className={cn('text-[13px] font-semibold tabular-nums', color)}>
        {value}
      </span>
    </div>
  );
}

