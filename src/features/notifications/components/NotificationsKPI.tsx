/* ═════════════════════════════════════════════════════════════════════
   Notifications — Notifications KPI Cards
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  CalendarDays,
  Activity,
  AtSign,
  AlertTriangle,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import type { NotificationStats } from '@/features/notifications/types/notifications.types';

interface NotificationsKPIProps {
  stats: NotificationStats;
}

export const NotificationsKPI = memo(function NotificationsKPI({
  stats,
}: NotificationsKPIProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      <KPICard
        icon={Bell}
        label="Non lues"
        value={stats.unread.toString()}
        description="Notifications en attente"
      />
      <KPICard
        icon={Calendar}
        label="Aujourd'hui"
        value={stats.today.toString()}
        description="Notifications reçues aujourd'hui"
      />
      <KPICard
        icon={CalendarDays}
        label="Cette semaine"
        value={stats.thisWeek.toString()}
        description="Notifications cette semaine"
      />
      <KPICard
        icon={Activity}
        label="Activités CRM"
        value={stats.crmActivities.toString()}
        description="Événements CRM récents"
      />
      <KPICard
        icon={AtSign}
        label="Mentions"
        value={stats.mentions.toString()}
        description="Mentions vous concernant"
      />
      <KPICard
        icon={AlertTriangle}
        label="Alertes"
        value={stats.alerts.toString()}
        description="Alertes système et avertissements"
      />
    </motion.div>
  );
});

