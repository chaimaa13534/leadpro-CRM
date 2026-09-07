/**
 * Kanban Board — conteneur principal du Pipeline.
 * Utilise @dnd-kit pour le Drag & Drop, Framer Motion pour les animations.
 * Supporte le clavier, le tactile et la souris.
 */
import { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import type { Opportunity } from '@/types/opportunity.types';
import type { PipelineColumn as PipelineColumnType } from '@/features/pipeline/types/pipeline.types';
import { PipelineColumn } from './PipelineColumn';
import { PipelineCard } from './PipelineCard';

interface PipelineBoardProps {
  columns: PipelineColumnType[];
  onDragEnd: (activeId: string, overColumnId: string) => void;
  onCardClick?: (opportunity: Opportunity) => void;
  onCardEdit?: (opportunity: Opportunity) => void;
  onCardView?: (opportunity: Opportunity) => void;
  onCardDelete?: (opportunity: Opportunity) => void;
}

export function PipelineBoard({
  columns,
  onDragEnd,
  onCardClick,
  onCardEdit,
  onCardView,
  onCardDelete,
}: PipelineBoardProps) {
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de mouvement avant activation
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const opp = columns
      .flatMap((col) => col.items)
      .find((item) => item.id === active.id);
    if (opp) setActiveOpportunity(opp);
  }, [columns]);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Gestion du hover entre colonnes — pourrait animer la colonne cible
  }, []);

  const handleDragEndCallback = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveOpportunity(null);

      if (!over) return;

      const activeId = String(active.id);
      let overColumnId = String(over.id);

      // Si l'élément survolé est une carte, on récupère l'id de sa colonne
      if (over.data.current?.type === 'opportunity') {
        const overOpp = over.data.current?.opportunity as Opportunity;
        overColumnId = overOpp.stage;
      }

      if (activeId !== overColumnId) {
        onDragEnd(activeId, overColumnId);
      }
    },
    [onDragEnd],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEndCallback}
    >
      <div
        className="flex gap-4 pb-4 overflow-x-auto snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch',
        }}
        role="region"
        aria-label="Pipeline Kanban"
      >
        {columns.map((column) => (
          <motion.div
            key={column.id}
            layout
            className="snap-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          >
            <PipelineColumn
              id={column.id}
              title={column.title}
              color={column.color}
              bgColor={column.bgColor}
              items={column.items}
              onCardClick={onCardClick}
              onCardEdit={onCardEdit}
              onCardView={onCardView}
              onCardDelete={onCardDelete}
            />
          </motion.div>
        ))}
      </div>

      {/* Drag overlay — carte fantôme pendant le déplacement */}
      <DragOverlay>
        {activeOpportunity ? (
          <div className="rotate-2 opacity-90">
            <PipelineCard
              opportunity={activeOpportunity}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

