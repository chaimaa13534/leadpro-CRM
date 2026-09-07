/* ═════════════════════════════════════════════════════════════════════
   Activity Center — ActivityItem
   Individual activity entry in the timeline
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Users,
  Building2,
  GitBranch,
  Calendar,
  ListTodo,
  BarChart3,
  MessageSquare,
  LogIn,
  LogOut,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { staggerItem } from '@/lib/motion-variants';
import { cn } from '@/lib/cn';
import { formatDate } from '@/utils/formatDate';
import type { Activity, ActivityType } from '@/types/activity.types';

interface ActivityItemProps {
  activity: Activity;
}

/* ── Activity type config ── */
const activityConfig: Record<
  ActivityType,
  { icon: LucideIcon; color: string; label: string }
> = {
  lead_created: { icon: Plus, color: 'text-accent', label: 'Création lead' },
  lead_updated: { icon: Edit, color: 'text-info-400', label: 'Modification lead' },
  lead_deleted: { icon: Trash2, color: 'text-danger-400', label: 'Suppression lead' },
  contact_created: { icon: Plus, color: 'text-accent', label: 'Nouveau contact' },
  contact_updated: { icon: Edit, color: 'text-info-400', label: 'Contact modifié' },
  contact_deleted: { icon: Trash2, color: 'text-danger-400', label: 'Contact supprimé' },
  company_created: { icon: Plus, color: 'text-accent', label: 'Nouvelle entreprise' },
  company_updated: { icon: Edit, color: 'text-info-400', label: 'Entreprise modifiée' },
  company_deleted: { icon: Trash2, color: 'text-danger-400', label: 'Entreprise supprimée' },
  opportunity_created: { icon: TrendingUp, color: 'text-accent', label: 'Nouvelle opp.' },
  opportunity_updated: { icon: Edit, color: 'text-info-400', label: 'Opportunité modifiée' },
  opportunity_deleted: { icon: Trash2, color: 'text-danger-400', label: 'Opportunité supprimée' },
  opportunity_won: { icon: CheckCircle2, color: 'text-success-400', label: 'Gagnée 🎉' },
  opportunity_lost: { icon: XCircle, color: 'text-danger-400', label: 'Perdue' },
  pipeline_moved: { icon: ArrowRight, color: 'text-warning-400', label: 'Pipeline' },
  meeting_scheduled: { icon: Calendar, color: 'text-accent', label: 'Réunion' },
  meeting_completed: { icon: CheckCircle2, color: 'text-success-400', label: 'Réunion faite' },
  meeting_cancelled: { icon: XCircle, color: 'text-danger-400', label: 'Réunion annulée' },
  task_created: { icon: Plus, color: 'text-accent', label: 'Tâche créée' },
  task_completed: { icon: CheckCircle2, color: 'text-success-400', label: 'Tâche faite' },
  task_updated: { icon: Edit, color: 'text-info-400', label: 'Tâche modifiée' },
  comment_added: { icon: MessageSquare, color: 'text-accent', label: 'Commentaire' },
  note_added: { icon: FileText, color: 'text-info-400', label: 'Note ajoutée' },
  user_login: { icon: LogIn, color: 'text-success-400', label: 'Connexion' },
  user_logout: { icon: LogOut, color: 'text-text-tertiary', label: 'Déconnexion' },
  report_generated: { icon: BarChart3, color: 'text-accent', label: 'Rapport' },
  email_sent: { icon: Mail, color: 'text-info-400', label: 'Email envoyé' },
  call_made: { icon: Phone, color: 'text-accent', label: 'Appel passé' },
};

/* ── Relative time ── */
function getTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getRelativeDay(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  return formatDate(dateStr, 'medium');
}

export const ActivityItem = memo(function ActivityItem({
  activity,
}: ActivityItemProps) {
  const config = activityConfig[activity.type];
  const Icon = config.icon;

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="flex gap-3 group"
    >
      {/* ── Timeline connector ── */}
      <div className="flex flex-col items-center shrink-0">
        <div className={cn('flex size-8 items-center justify-center rounded-full bg-surface border border-border', config.color)}>
          <Icon className="size-3.5" />
        </div>
        <div className="w-px flex-1 bg-border/50 group-last:hidden" />
      </div>

      {/* ── Content ── */}
      <div className="flex-1 min-w-0 pb-6 group-last:pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar
              firstName={activity.actorName.split(' ')[0]}
              lastName={activity.actorName.split(' ')[1]}
              size="xs"
            />
            <div className="min-w-0">
              <p className="text-[13px] text-text-primary leading-snug">
                <span className="font-semibold">{activity.actorName}</span>
                {' '}
                <span className="text-text-tertiary">{config.label.toLowerCase()}</span>
              </p>
              <p className="mt-0.5 text-[12px] text-text-tertiary leading-relaxed">
                {activity.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[11px] font-medium tabular-nums text-text-tertiary">
              {getTime(activity.occurredAt)}
            </span>
            <Badge variant="neutral" size="sm">
              {activity.module}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

