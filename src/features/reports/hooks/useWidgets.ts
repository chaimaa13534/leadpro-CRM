/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — useWidgets Hook
   Draggable widget layout persistence with dnd-kit + localStorage
   ═════════════════════════════════════════════════════════════════════ */

import { useState, useCallback } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { WidgetConfig, WidgetLayout } from '@/features/reports/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'widget-kpi-overview', type: 'kpi-overview', title: 'Vue d\'ensemble KPI', visible: true, size: 'full', order: 0 },
  { id: 'widget-revenue-chart', type: 'revenue-chart', title: 'Revenus', visible: true, size: 'large', order: 1 },
  { id: 'widget-pipeline-chart', type: 'pipeline-chart', title: 'Pipeline', visible: true, size: 'medium', order: 2 },
  { id: 'widget-lead-source', type: 'lead-source', title: 'Sources de Leads', visible: true, size: 'medium', order: 3 },
  { id: 'widget-conversion-chart', type: 'conversion-chart', title: 'Taux de Conversion', visible: true, size: 'medium', order: 4 },
  { id: 'widget-sales-chart', type: 'sales-chart', title: 'Performance Commerciale', visible: true, size: 'large', order: 5 },
  { id: 'widget-forecast-chart', type: 'forecast-chart', title: 'Prévisions', visible: true, size: 'medium', order: 6 },
  { id: 'widget-deals-chart', type: 'deals-chart', title: 'Affaires', visible: true, size: 'medium', order: 7 },
  { id: 'widget-team-performance', type: 'team-performance', title: 'Performance Équipe', visible: true, size: 'large', order: 8 },
  { id: 'widget-top-companies', type: 'top-companies', title: 'Top Entreprises', visible: true, size: 'medium', order: 9 },
  { id: 'widget-top-sales', type: 'top-sales', title: 'Top Commerciaux', visible: true, size: 'medium', order: 10 },
  { id: 'widget-top-opportunities', type: 'top-opportunities', title: 'Top Opportunités', visible: true, size: 'medium', order: 11 },
  { id: 'widget-recent-activities', type: 'recent-activities', title: 'Activités Récentes', visible: true, size: 'medium', order: 12 },
  { id: 'widget-leaderboard', type: 'leaderboard', title: 'Classement', visible: true, size: 'medium', order: 13 },
];

const DEFAULT_LAYOUT: WidgetLayout = { widgets: DEFAULT_WIDGETS };

export function useWidgets() {
  const [layout, setLayout] = useLocalStorage<WidgetLayout>('leadpro-reports-widgets', DEFAULT_LAYOUT);
  const [editingWidget, setEditingWidget] = useState<string | null>(null);

  const visibleWidgets = layout.widgets
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      if (activeId === overId) return;

      setLayout((prev) => {
        const widgets = [...prev.widgets];
        const oldIndex = widgets.findIndex((w) => w.id === activeId);
        const newIndex = widgets.findIndex((w) => w.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const [moved] = widgets.splice(oldIndex, 1);
        if (!moved) return prev;
        widgets.splice(newIndex, 0, moved);

        return {
          ...prev,
          widgets: widgets.map((w, i) => ({ ...w, order: i })),
        };
      });
    },
    [setLayout],
  );

  const toggleWidgetVisibility = useCallback(
    (widgetId: string) => {
      setLayout((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) =>
          w.id === widgetId ? { ...w, visible: !w.visible } : w,
        ),
      }));
    },
    [setLayout],
  );

  const updateWidgetSize = useCallback(
    (widgetId: string, size: WidgetConfig['size']) => {
      setLayout((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) =>
          w.id === widgetId ? { ...w, size } : w,
        ),
      }));
    },
    [setLayout],
  );

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_LAYOUT);
  }, [setLayout]);

  const openWidgetSettings = useCallback((widgetId: string) => {
    setEditingWidget(widgetId);
  }, []);

  const closeWidgetSettings = useCallback(() => {
    setEditingWidget(null);
  }, []);

  const getWidgetConfig = useCallback(
    (widgetId: string): WidgetConfig | undefined => {
      return layout.widgets.find((w) => w.id === widgetId);
    },
    [layout.widgets],
  );

  return {
    layout,
    visibleWidgets,
    editingWidget,
    handleDragEnd,
    toggleWidgetVisibility,
    updateWidgetSize,
    resetLayout,
    openWidgetSettings,
    closeWidgetSettings,
    getWidgetConfig,
  };
}
