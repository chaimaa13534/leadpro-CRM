/* ═════════════════════════════════════════════════════════════════════
   Settings — SecurityActivity
   Timeline des événements de sécurité du compte.
   ═════════════════════════════════════════════════════════════════════ */

import { type LucideIcon } from 'lucide-react';
import {
  LogIn,
  KeyRound,
  ShieldCheck,
  ShieldOff,
  MonitorOff,
  AlertTriangle,
  Mail,
  UserX,
} from 'lucide-react';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/lib/cn';
import type { SecurityActivityEvent } from '@/features/settings/types';

const EVENT_ICONS: Record<SecurityActivityEvent['type'], { icon: LucideIcon; color: string }> = {
  login: { icon: LogIn, color: 'text-info-400 bg-info-500/10' },
  password_change: { icon: KeyRound, color: 'text-warning-400 bg-warning-500/10' },
  two_factor_enabled: { icon: ShieldCheck, color: 'text-success-400 bg-success-500/10' },
  two_factor_disabled: { icon: ShieldOff, color: 'text-warning-400 bg-warning-500/10' },
  session_revoked: { icon: MonitorOff, color: 'text-danger-400 bg-danger-500/10' },
  security_alert: { icon: AlertTriangle, color: 'text-danger-400 bg-danger-500/10' },
  email_changed: { icon: Mail, color: 'text-info-400 bg-info-500/10' },
  account_deactivated: { icon: UserX, color: 'text-danger-400 bg-danger-500/10' },
};

interface SecurityActivityProps {
  events: SecurityActivityEvent[];
  loading?: boolean;
}

/* ═══════════════════════════════════════════════════════ */
export function SecurityActivity({ events, loading = false }: SecurityActivityProps) {
  return (
    <SettingsSection
      title="Activité de sécurité"
      description="Historique des événements liés à la sécurité de votre compte."
    >
      <SettingsCard>
        <ol className="relative space-y-0 p-5">
          {events.map((event, index) => {
            const { icon: Icon, color } = EVENT_ICONS[event.type];
            const isLast = index === events.length - 1;
            return (
              <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute left-[18px] top-9 h-[calc(100%-2.25rem)] w-px bg-border"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    'z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    color,
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-[13px] font-medium text-text-primary">
                      {event.title}
                    </p>
                    <time className="text-[11px] text-text-tertiary">
                      {formatDate(event.occurredAt)}
                    </time>
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-text-tertiary">
                    {event.description}
                  </p>
                  {(event.location || event.device) && (
                    <p className="mt-1 text-[11px] text-text-disabled">
                      {[event.location, event.device].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </SettingsCard>
    </SettingsSection>
  );
}

export default SecurityActivity;

