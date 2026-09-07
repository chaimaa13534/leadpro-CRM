import { memo, type ReactNode } from 'react';
import { GripVertical, Settings2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  onSettings?: () => void;
  className?: string;
}

export const DashboardWidget = memo(function DashboardWidget({ title, children, onSettings, className }: DashboardWidgetProps) {
  return (
    <Card variant="elevated" padding="md" className={cn('relative h-full', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center gap-1">
          {onSettings ? (
            <Button variant="ghost" size="icon-sm" onClick={onSettings} aria-label={`Paramètres ${title}`}>
              <Settings2 className="size-3.5" />
            </Button>
          ) : null}
          <div className="flex size-7 items-center justify-center rounded-md text-text-tertiary">
            <GripVertical className="size-4" />
          </div>
        </div>
      </div>
      {children}
    </Card>
  );
});
