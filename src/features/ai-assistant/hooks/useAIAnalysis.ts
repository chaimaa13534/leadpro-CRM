/**
 * useAIAnalysis — Récupère les analyses AI (lead, opportunité, pipeline).
 */

import { useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/ai-service';
import type {
  AILeadAnalysis,
  AIOpportunityAnalysis,
  AIPipelineAnalysis,
} from '../types/ai.types';

interface UseAIAnalysisReturn {
  leadAnalysis: AILeadAnalysis[];
  opportunityAnalysis: AIOpportunityAnalysis[];
  pipelineAnalysis: AIPipelineAnalysis[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAIAnalysis(): UseAIAnalysisReturn {
  const [leadAnalysis, setLeadAnalysis] = useState<AILeadAnalysis[]>([]);
  const [opportunityAnalysis, setOpportunityAnalysis] = useState<AIOpportunityAnalysis[]>([]);
  const [pipelineAnalysis, setPipelineAnalysis] = useState<AIPipelineAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadRes, oppRes, pipelineRes] = await Promise.all([
        aiService.getLeadAnalysis(),
        aiService.getOpportunityAnalysis(),
        aiService.getPipelineAnalysis(),
      ]);
      setLeadAnalysis(leadRes.data);
      setOpportunityAnalysis(oppRes.data);
      setPipelineAnalysis(pipelineRes.data);
    } catch {
      setError('Impossible de charger les analyses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    leadAnalysis,
    opportunityAnalysis,
    pipelineAnalysis,
    loading,
    error,
    refresh: fetchAll,
  };
}

