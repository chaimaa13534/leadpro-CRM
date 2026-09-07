import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { WidgetConfig } from '@/features/reports/types';

interface WidgetSettingsProps {
  widget: WidgetConfig;
  onClose: () => void;
  onToggleVisibility: (widgetId: string) => void;
  onChangeSize: (widgetId: string, size: WidgetConfig['size']) => void;
}

export const WidgetSettings = memo(function WidgetSettings({ widget, onClose, onToggleVisibility, onChangeSize }: WidgetSettingsProps) {
  return (
    <Card variant="outlined" padding="md" className="mb-4 border-accent/40">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-text-primary">Paramètres du widget</p>
          <Button variant="ghost" size="sm" onClick={onClose}>Fermer</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onToggleVisibility(widget.id)}>
            {widget.visible ? 'Masquer' : 'Afficher'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onChangeSize(widget.id, 'small')}>
            Petit
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onChangeSize(widget.id, 'medium')}>
            Moyen
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onChangeSize(widget.id, 'large')}>
            Grand
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
