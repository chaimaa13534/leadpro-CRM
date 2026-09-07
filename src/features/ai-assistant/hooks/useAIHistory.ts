/**
 * useAIHistory — Gère l'historique des conversations AI, la recherche et le tri.
 */

import { useState, useMemo, useCallback } from 'react';
import { aiService } from '../services/ai-service';
import type { AIConversation } from '../types/ai.types';

interface UseAIHistoryReturn {
  conversations: AIConversation[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredConversations: AIConversation[];
  refresh: () => Promise<void>;
}

export function useAIHistory(
  externalConversations: AIConversation[] = [],
): UseAIHistoryReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return externalConversations;

    const q = searchQuery.toLowerCase();
    return externalConversations.filter(
      (conv) =>
        conv.title.toLowerCase().includes(q) ||
        conv.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }, [externalConversations, searchQuery]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await aiService.getConversations();
    } catch {
      // Silently fail — data is already in state
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    conversations: externalConversations,
    loading,
    searchQuery,
    setSearchQuery,
    filteredConversations,
    refresh,
  };
}

