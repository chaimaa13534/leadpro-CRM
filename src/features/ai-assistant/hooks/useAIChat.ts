/**
 * useAIChat — Gère l'état du chat AI, l'envoi de messages et la réponse simulée.
 */

import { useState, useCallback, useRef } from 'react';
import type {
  AIMessage,
  AIMessageActions,
  AIChatState,
  AIProcessingState,
  AIServiceResponse,
  AIConversation,
} from '../types/ai.types';
import { generateId } from '@/utils/generateId';
import { aiService } from '../services/ai-service';

const INITIAL_STATE: AIChatState = {
  conversations: [],
  currentConversationId: null,
  processingState: 'idle',
  error: null,
};

export function useAIChat() {
  const [state, setState] = useState<AIChatState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const currentConversation = state.currentConversationId
    ? state.conversations.find((c) => c.id === state.currentConversationId) ?? null
    : null;

  const messages = currentConversation?.messages ?? [];

  const setProcessingState = useCallback((processingState: AIProcessingState) => {
    setState((prev) => ({ ...prev, processingState }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  /** Crée ou récupère la conversation active. */
  const ensureConversation = useCallback((): AIConversation => {
    let conv = currentConversation;
    if (!conv) {
      conv = {
        id: generateId(),
        title: 'Nouvelle conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        messageCount: 0,
      };
      setState((prev) => ({
        ...prev,
        conversations: [conv!, ...prev.conversations],
        currentConversationId: conv!.id,
      }));
    }
    return conv;
  }, [currentConversation]);

  /** Ajoute un message utilisateur et génère une réponse AI. */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.processingState === 'thinking') return;

      const conv = ensureConversation();
      const userMessage: AIMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
        actions: { copied: false, liked: null, disliked: null },
      };

      // Ajout du message utilisateur
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === conv.id
            ? {
                ...c,
                messages: [...c.messages, userMessage],
                messageCount: c.messageCount + 1,
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
        processingState: 'thinking',
        error: null,
      }));

      abortRef.current = new AbortController();

      try {
        const response: AIServiceResponse = await aiService.sendMessage(
          content.trim(),
          abortRef.current.signal,
        );

        const assistantMessage: AIMessage = {
          id: generateId(),
          role: 'assistant',
          content: response.data,
          timestamp: new Date().toISOString(),
          responseType: 'text',
          metadata: {
            processingTime: response.processingTime,
            thinkingSteps: response.thinkingSteps,
          },
          actions: { copied: false, liked: null, disliked: null },
        };

        setState((prev) => ({
          ...prev,
          conversations: prev.conversations.map((c) =>
            c.id === conv.id
              ? {
                  ...c,
                  messages: [...c.messages, assistantMessage],
                  messageCount: c.messageCount + 1,
                  title:
                    c.messages.length === 1
                      ? content.trim().slice(0, 60)
                      : c.title,
                  updatedAt: new Date().toISOString(),
                }
              : c,
          ),
          processingState: 'complete',
        }));
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError("Une erreur est survenue lors de la génération de la réponse.");
        setState((prev) => ({ ...prev, processingState: 'error' }));
      }
    },
    [state.processingState, ensureConversation],
  );

  /** Met à jour les actions (copier, liker, disliker) sur un message. */
  const updateMessageActions = useCallback(
    (messageId: string, actions: Partial<AIMessageActions>) => {
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === prev.currentConversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId
                    ? { ...m, actions: { ...m.actions!, ...actions } }
                    : m,
                ),
              }
            : c,
        ),
      }));
    },
    [],
  );

  /** Sélectionne une conversation existante. */
  const selectConversation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      currentConversationId: id,
      error: null,
    }));
  }, []);

  /** Supprime une conversation. */
  const deleteConversation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.filter((c) => c.id !== id),
      currentConversationId:
        prev.currentConversationId === id
          ? prev.conversations.filter((c) => c.id !== id)[0]?.id ?? null
          : prev.currentConversationId,
    }));
  }, []);

  /** Crée une nouvelle conversation. */
  const newConversation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentConversationId: null,
      processingState: 'idle',
      error: null,
    }));
  }, []);

  /** Annule la génération en cours. */
  const abortRequest = useCallback(() => {
    abortRef.current?.abort();
    setState((prev) => ({ ...prev, processingState: 'idle' }));
  }, []);

  return {
    conversations: state.conversations,
    currentConversation,
    currentConversationId: state.currentConversationId,
    messages,
    processingState: state.processingState,
    error: state.error,
    sendMessage,
    updateMessageActions,
    selectConversation,
    deleteConversation,
    newConversation,
    abortRequest,
  };
}

