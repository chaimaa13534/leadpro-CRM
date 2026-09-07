/**
 * useAIInsights — Récupère et filtre les insights AI.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { aiService } from '../services/ai-service';
import type { AIInsight, AIInsightPriority } from '../types/ai.types';

interface UseAIInsightsReturn {
  insights: AIInsight[];
  loading: boolean;
  error: string | null;
  priorityFilter: AIInsightPriority | 'all';
  setPriorityFilter: (p: AIInsightPriority | 'all') => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  filteredInsights: AIInsight[];
  categories: string[];
  refresh: () => Promise<void>;
}

export function useAIInsights(): UseAIInsightsReturn {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<AIInsightPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.getInsights();
      setInsights(response.data);
    } catch {
      setError('Impossible de charger les insights.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const categories = useMemo(() => {
    const cats = new Set(insights.map((i) => i.category));
    return Array.from(cats).sort();
  }, [insights]);

  const filteredInsights = useMemo(() => {
    return insights.filter((i) => {
      if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false;
      if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
      return true;
    });
  }, [insights, priorityFilter, categoryFilter]);

  return {
    insights,
    loading,
    error,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    filteredInsights,
    categories,
    refresh: fetchInsights,
  };
}

