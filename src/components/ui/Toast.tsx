import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ToastNotification } from '@/types/toast.types';

type ToastVariant = Extract<ToastNotification['variant'], 'success' | 'error' | 'warning' | 'info'>;

interface ToastProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; styles: string }> = {
  success: {
    icon: CheckCircle2,
    styles: 'border-success-200 dark:border-success-500/20',
  },
  error: {
    icon: XCircle,
    styles: 'border-danger-200 dark:border-danger-500/20',
  },
  warning: {
    icon: AlertTriangle,
    styles: 'border-warning-200 dark:border-warning-500/20',
  },
  info: {
    icon: Info,
    styles: 'border-info-200 dark:border-info-500/20',
  },
};

const iconColors: Record<ToastVariant, string> = {
  success: 'text-success-500',
  error: 'text-danger-500',
  warning: 'text-warning-500',
  info: 'text-info-500',
};

/* ═══════════════════════════════════════════════════════ */
export function Toast({ notification, onDismiss }: ToastProps) {
  const variant = notification.variant as ToastVariant;
  const { icon: Icon, styles } = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'flex items-start gap-3 rounded-xl border bg-surface p-4 shadow-lg min-w-[320px] max-w-[420px]',
        styles
      )}
      role="alert"
    >
      <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', iconColors[variant])} />
      <p className="flex-1 text-[13px] text-text-primary leading-relaxed">
        {notification.message}
      </p>
      <button
        onClick={() => onDismiss(notification.id)}
        className="shrink-0 rounded-md p-0.5 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-secondary"
        aria-label="Fermer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

/* ── Toast container ── */
export function ToastContainer({
  notifications,
  onDismiss,
}: {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
      <AnimatePresence>
        {notifications.map((n) => (
          <Toast key={n.id} notification={n} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
