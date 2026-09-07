/**
 * Hook principal du Pipeline Kanban.
 * Gère l'état du board, le DnD, le filtrage et la recherche.
 */
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Opportunity, PipelineStage } from '@/types/opportunity.types';
import type { PipelineFilters, PipelineSort, PipelineColumn } from '@/features/pipeline/types/pipeline.types';
import { PIPELINE_COLUMNS } from '@/features/pipeline/types/pipeline.types';
import {
  getPipelineOpportunities,
  moveOpportunityStage,
  resetPipelineData,
  updateOpportunityField,
} from '@/features/pipeline/services/pipeline.service';
import { usersMock } from '@/mocks/users.mock';

export function usePipelineBoard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PipelineFilters>({
    search: '',
    ownerId: 'all',
    pipeline: 'all',
    stage: 'all',
    priority: 'all',
    probabilityRange: 'all',
    valueRange: 'all',
    companyName: 'all',
    dateRange: 'all',
  });
  const [sort, setSort] = useState<PipelineSort>('order');
  const [activePipeline, setActivePipeline] = useState('Sales Pipeline');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  const dataRef = useRef(opportunities);
  dataRef.current = opportunities;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPipelineOpportunities();
      setOpportunities(data);
    } catch {
      setError('Erreur lors du chargement du pipeline.');
    } finally {
      setIsLoading(false);
    }
  }

  const refresh = useCallback(async () => {
    await loadData();
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      ownerId: 'all',
      pipeline: 'all',
      stage: 'all',
      priority: 'all',
      probabilityRange: 'all',
      valueRange: 'all',
      companyName: 'all',
      dateRange: 'all',
    });
    setSearchQuery('');
    setSort('order');
    setResetCounter((c) => c + 1);
  }, []);

  /** Déplacement DnD d'une carte vers une nouvelle colonne */
  const handleDragEnd = useCallback(
    async (activeId: string, overColumnId: string) => {
      const opp = dataRef.current.find((o) => o.id === activeId);
      if (!opp || opp.stage === overColumnId) return;

      const newStage = overColumnId as PipelineStage;
      // Optimistic update
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === activeId ? { ...o, stage: newStage, updatedAt: new Date().toISOString() } : o,
        ),
      );

      try {
        await moveOpportunityStage(activeId, newStage);
      } catch {
        // Rollback
        setOpportunities((prev) =>
          prev.map((o) =>
            o.id === activeId ? { ...o, stage: opp.stage, updatedAt: opp.updatedAt } : o,
          ),
        );
      }
    },
    [],
  );

  /** Mise à jour d'un champ d'une opportunité */
  const handleUpdateField = useCallback(
    async <K extends keyof Opportunity>(
      opportunityId: string,
      field: K,
      value: Opportunity[K],
    ) => {
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === opportunityId ? { ...o, [field]: value, updatedAt: new Date().toISOString() } : o,
        ),
      );
      try {
        await updateOpportunityField(opportunityId, field, value);
      } catch {
        // Rollback handled by refresh
        await loadData();
      }
    },
    [],
  );

  /** Ouverture du drawer de détail */
  const openDrawer = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedOpportunity(null), 200);
  }, []);

  /** Filtrage et recherche */
  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];

    // Recherche textuelle
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (o) =>
          o.name.toLowerCase().includes(query) ||
          (o.companyName ?? '').toLowerCase().includes(query) ||
          (o.contactName ?? '').toLowerCase().includes(query) ||
          usersMock.find((u) => u.id === o.ownerId)?.firstName.toLowerCase().includes(query) ||
          usersMock.find((u) => u.id === o.ownerId)?.lastName.toLowerCase().includes(query),
      );
    }

    // Filtres
    if (filters.ownerId !== 'all') {
      result = result.filter((o) => o.ownerId === filters.ownerId);
    }
    if (filters.pipeline !== 'all') {
      result = result.filter((o) => o.pipeline === filters.pipeline);
    }
    if (filters.stage !== 'all') {
      result = result.filter((o) => o.stage === filters.stage);
    }
    if (filters.priority !== 'all') {
      result = result.filter((o) => o.priority === filters.priority);
    }
    if (filters.companyName !== 'all') {
      result = result.filter((o) => o.companyName === filters.companyName);
    }

    // Filtre probabilité
    if (filters.probabilityRange !== 'all') {
      const parts = filters.probabilityRange.split('-').map(Number);
      const probMin = parts[0] ?? 0;
      const probMax = parts[1] ?? 100;
      result = result.filter((o) => o.probability >= probMin && o.probability <= probMax);
    }

    // Filtre valeur
    if (filters.valueRange !== 'all') {
      const parts = filters.valueRange.split('-').map(Number);
      const valMin = parts[0] ?? 0;
      const valMax = parts[1] ?? Number.MAX_SAFE_INTEGER;
      result = result.filter((o) => o.amount >= valMin && o.amount <= valMax);
    }

    return result;
  }, [opportunities, searchQuery, filters]);

  /** Tri des cartes dans chaque colonne */
  const sortCards = useCallback(
    (cards: Opportunity[]): Opportunity[] => {
      const sorted = [...cards];
      switch (sort) {
        case 'value_desc':
          sorted.sort((a, b) => b.amount - a.amount);
          break;
        case 'value_asc':
          sorted.sort((a, b) => a.amount - b.amount);
          break;
        case 'probability':
          sorted.sort((a, b) => b.probability - a.probability);
          break;
        case 'name':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      return sorted;
    },
    [sort],
  );

  /** Construction des colonnes avec leurs opportunités */
  const columns: PipelineColumn[] = useMemo(() => {
    return PIPELINE_COLUMNS.map((col) => ({
      ...col,
      items: sortCards(filteredOpportunities.filter((o) => o.stage === col.id)),
    }));
  }, [filteredOpportunities, sortCards]);

  /** Statistiques du pipeline */
  const pipelineStats = useMemo(() => {
    const totalOpportunities = opportunities.length;
    const totalValue = opportunities
      .filter((o) => o.stage !== 'closed_lost')
      .reduce((sum, o) => sum + o.amount, 0);
    const averageDeal = totalOpportunities > 0 ? totalValue / totalOpportunities : 0;
    const forecastRevenue = opportunities
      .filter((o) => o.stage !== 'closed_won' && o.stage !== 'closed_lost')
      .reduce((sum, o) => sum + o.amount * (o.probability / 100), 0);
    const wonDeals = opportunities.filter((o) => o.stage === 'closed_won').length;
    const wonValue = opportunities
      .filter((o) => o.stage === 'closed_won')
      .reduce((sum, o) => sum + o.amount, 0);
    const lostDeals = opportunities.filter((o) => o.stage === 'closed_lost').length;
    const lostValue = opportunities
      .filter((o) => o.stage === 'closed_lost')
      .reduce((sum, o) => sum + o.amount, 0);
    const closedDeals = wonDeals + lostDeals;
    const conversionRate = closedDeals > 0 ? (wonDeals / closedDeals) * 100 : 0;

    const stageDistribution = PIPELINE_COLUMNS.map((col) => {
      const items = opportunities.filter((o) => o.stage === col.id);
      return {
        stage: col.id,
        count: items.length,
        value: items.reduce((sum, o) => sum + o.amount, 0),
        percentage: totalOpportunities > 0 ? (items.length / totalOpportunities) * 100 : 0,
      };
    });

    return {
      totalOpportunities,
      totalValue,
      averageDeal,
      forecastRevenue,
      wonDeals,
      wonValue,
      lostDeals,
      lostValue,
      conversionRate,
      stageDistribution,
    };
  }, [opportunities]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filters.ownerId !== 'all' ||
    filters.pipeline !== 'all' ||
    filters.stage !== 'all' ||
    filters.priority !== 'all' ||
    filters.probabilityRange !== 'all' ||
    filters.valueRange !== 'all' ||
    filters.companyName !== 'all';

  return {
    // State
    opportunities,
    columns,
    isLoading,
    error,
    searchQuery,
    filters,
    sort,
    activePipeline,
    selectedOpportunity,
    isDrawerOpen,
    resetCounter,
    hasActiveFilters,
    pipelineStats,

    // Actions
    setSearchQuery: (q: string) => {
      setSearchQuery(q);
      setFilters((f) => ({ ...f, search: q }));
    },
    setFilters,
    setSort,
    setActivePipeline,
    refresh,
    resetFilters,
    handleDragEnd,
    handleUpdateField,
    openDrawer,
    closeDrawer,
  };
}

