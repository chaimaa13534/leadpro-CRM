/* ═════════════════════════════════════════════════════════════════════
   Notifications — NotificationCard
   Premium card with icon, avatar, priority, status, and actions
   ═════════════════════════════════════════════════════════════════════ */

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Target,
  Users,
  Building2,
  GitBranch,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  AtSign,
  ListTodo,
  BarChart3,
  LogIn,
  MessageSquare,
  ShieldAlert,
  Star,
  Clock,
  Check,
  Archive,
  Trash2,
  Mail,
  MailOpen,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown';
import { formatDate } from '@/utils/formatDate';
import { staggerItem } from '@/lib/motion-variants';
import type { Notification, NotificationPriority, NotificationModule } from '@/types/notification.types';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen?: (notification: Notification) => void;
}

/* ── Module icons ── */
const moduleIcons: Record<NotificationModule, typeof Bell> = {
  leads: Target,
  contacts: Users,
  companies: Building2,
  opportunities: GitBranch,
  pipeline: GitBranch,
  tasks: ListTodo,
  meetings: Calendar,
  reports: BarChart3,
  system: ShieldAlert,
  mentions: AtSign,
};

/* ── Priority config ── */
const priorityConfig: Record<NotificationPriority, { label: string; variant: 'info' | 'warning' | 'danger' | 'neutral'; icon: typeof Bell }> = {
  low: { label: 'Basse', variant: 'neutral', icon: Info },
  normal: { label: 'Normale', variant: 'info', icon: Bell },
  high: { label: 'Haute', variant: 'warning', icon: AlertTriangle },
  urgent: { label: 'Urgente', variant: 'danger', icon: AlertCircle },
};

/* ── Relative time helper ── */
function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return formatDate(dateStr, 'short');
}

export const NotificationCard = memo(function NotificationCard({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
  onOpen,
}: NotificationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ModuleIcon = moduleIcons[notification.module] ?? Bell;
  const priority = priorityConfig[notification.priority];
  const isArchived = notification.status === 'archived';

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex gap-4 rounded-xl border p-4 transition-all duration-200',
        !notification.isRead
          ? 'border-accent/20 bg-accent-subtle/40'
          : isArchived
            ? 'border-border/40 bg-surface/50 opacity-70'
            : 'border-border bg-surface hover:border-border-hover hover:shadow-sm',
        'cursor-default',
      )}
      role="listitem"
      aria-label={`Notification: ${notification.title}`}
    >
      {/* ── Status indicator line ── */}
      {!notification.isRead && (
        <span className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-accent" />
      )}

      {/* ── Icon / Avatar ── */}
      <div className="flex shrink-0 flex-col items-center gap-2">
        {notification.authorAvatarUrl || Math.random() > 0.7 ? (
          <Avatar
            firstName={notification.authorName.split(' ')[0]}
            lastName={notification.authorName.split(' ')[1]}
            size="md"
          />
        ) : (
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-full',
              !notification.isRead ? 'bg-accent-subtle text-accent' : 'bg-surface-hover text-text-tertiary',
            )}
          >
            <ModuleIcon className="size-4" />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className={cn(
                'text-[13px] leading-snug',
                !notification.isRead ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary',
              )}
            >
              {notification.title}
            </h3>
            <p className="mt-0.5 text-[12px] text-text-tertiary leading-relaxed line-clamp-2">
              {notification.message}
            </p>
          </div>

          {/* ── Actions dropdown ── */}
          <Dropdown
            trigger={
              <button
                className={cn(
                  'flex size-7 items-center justify-center rounded-lg text-text-tertiary transition-all',
                  'opacity-0 group-hover:opacity-100 hover:bg-surface-hover hover:text-text-secondary',
                  isHovered && 'opacity-100',
                )}
                aria-label="Actions"
              >
                <MoreHorizontal className="size-4" />
              </button>
            }
          >
            {notification.isRead ? (
              <DropdownItem
                icon={<Mail className="size-4" />}
                onClick={() => onMarkAsUnread(notification.id)}
              >
                Marquer comme non lu
              </DropdownItem>
            ) : (
              <DropdownItem
                icon={<MailOpen className="size-4" />}
                onClick={() => onMarkAsRead(notification.id)}
              >
                Marquer comme lu
              </DropdownItem>
            )}
            {!isArchived && (
              <DropdownItem
                icon={<Archive className="size-4" />}
                onClick={() => onArchive(notification.id)}
              >
                Archiver
              </DropdownItem>
            )}
            {notification.linkTo && onOpen && (
              <DropdownItem
                icon={<ExternalLink className="size-4" />}
                onClick={() => onOpen(notification)}
              >
                Ouvrir l'élément
              </DropdownItem>
            )}
            <DropdownSeparator />
            <DropdownItem
              icon={<Trash2 className="size-4" />}
              danger
              onClick={() => onDelete(notification.id)}
            >
              Supprimer
            </DropdownItem>
          </Dropdown>
        </div>

        {/* ── Meta row ── */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {/* Priority badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium',
              priority.variant === 'danger' && 'bg-danger-50 text-danger-400',
              priority.variant === 'warning' && 'bg-warning-50 text-warning-400',
              priority.variant === 'info' && 'bg-info-50 text-info-400',
              priority.variant === 'neutral' && 'bg-background-tertiary text-text-tertiary',
            )}
          >
            <priority.icon className="size-3" />
            {priority.label}
          </span>

          {/* Module badge */}
          <Badge variant="primary" size="sm">
            {notification.module}
          </Badge>

          {/* Author */}
          <span className="text-[11px] text-text-tertiary">
            par {notification.authorName}
          </span>

          {/* Relative time */}
          <span className="flex items-center gap-1 text-[11px] text-text-tertiary ml-auto">
            <Clock className="size-3" />
            {getRelativeTime(notification.createdAt)}
          </span>

          {/* Read status */}
          {notification.isRead && (
            <span className="flex items-center gap-1 text-[11px] text-success-500">
              <Check className="size-3" />
              Lu
            </span>
          )}

          {/* Archived */}
          {isArchived && (
            <span className="flex items-center gap-1 text-[11px] text-text-disabled">
              <Archive className="size-3" />
              Archivé
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

