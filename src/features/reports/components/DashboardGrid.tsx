import { memo, type ReactNode } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { WidgetConfig } from '@/features/reports/types';

interface DashboardGridProps {
  widgets: WidgetConfig[];
  children: (widget: WidgetConfig) => ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  onReset: () => void;
}

function SortableWidget({ widget, children }: { widget: WidgetConfig; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div ref={setNodeRef} style={style} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={isDragging ? 'opacity-60' : ''} {...attributes}>
      <div {...listeners} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}

export const DashboardGrid = memo(function DashboardGrid({ widgets, children, onDragEnd, onReset }: DashboardGridProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-text-primary">Dashboard personnalisable</h3>
          <p className="text-[12px] text-text-tertiary">Glissez les widgets pour réorganiser l’espace</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>Réinitialiser</Button>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={widgets.map((widget) => widget.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4 lg:grid-cols-2">
            {widgets.map((widget) => (
              <SortableWidget key={widget.id} widget={widget}>
                {children(widget)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
});
