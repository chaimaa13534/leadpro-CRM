import type { ReactNode } from 'react';
import { type LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  description?: string;
  action?: ReactNode | {
    label?: string;
    onClick?: () => void;
    element?: ReactNode;
  };
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const iconContent = typeof Icon === 'function' ? <Icon className="h-6 w-6 text-text-tertiary" /> : Icon;

  const renderedAction: ReactNode = (() => {
    if (action === undefined || action === null) {
      return undefined;
    }

    if (typeof action === 'object' && !('type' in action)) {
      const actionObject = action as {
        label?: string;
        onClick?: () => void;
        element?: ReactNode;
      };

      if ('element' in actionObject && actionObject.element !== undefined) {
        return actionObject.element;
      }

      return (
        <Button size="sm" onClick={actionObject.onClick}>
          {actionObject.label}
        </Button>
      );
    }

    return action as ReactNode;
  })();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-tertiary mb-4">
        {iconContent}
      </div>
      <h3 className="text-[14px] font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-[13px] text-text-tertiary max-w-sm mb-5">{description}</p>
      )}
      {renderedAction}
    </div>
  );
}
