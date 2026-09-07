import { type LucideIcon, Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const config: Record<AlertVariant, { icon: LucideIcon; styles: string }> = {
  info: {
    icon: Info,
    styles: 'bg-info-50/80 border-info-500/20 text-info-300',
  },
  success: {
    icon: CheckCircle2,
    styles: 'bg-success-50/80 border-success-500/20 text-success-300',
  },
  warning: {
    icon: AlertTriangle,
    styles: 'bg-warning-50/80 border-warning-500/20 text-warning-300',
  },
  danger: {
    icon: XCircle,
    styles: 'bg-danger-50/80 border-danger-500/20 text-danger-300',
  },
};

/* ═══════════════════════════════════════════════════════ */
export function AlertTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('mb-0.5 text-[13px] font-semibold', className)}>{children}</p>;
}

export function AlertDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-[13px] leading-relaxed', className)}>{children}</div>;
}

export function SuccessAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="success" className={className}>
      {children}
    </Alert>
  );
}

export function ErrorAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="danger" className={className}>
      {children}
    </Alert>
  );
}

export function InfoAlert({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <Alert variant="info" title={title} className={className}>
      {children}
    </Alert>
  );
}

/* ═══════════════════════════════════════════════════════ */
export function Alert({ variant = 'info', title, children, dismissible, onDismiss, className }: AlertProps) {
  const { icon: Icon, styles } = config[variant];

  return (
    <div className={cn('flex gap-3 rounded-xl border p-4', styles, className)} role="alert">
      <Icon className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="mb-0.5 text-[13px] font-semibold">{title}</p>}
        <div className="text-[13px] leading-relaxed">{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

