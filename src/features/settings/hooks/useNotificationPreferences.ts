/* ═════════════════════════════════════════════════════════════════════
   Settings — useNotificationPreferences
   Charge et met à jour les préférences de notifications, persistées
   dans localStorage via la couche storage.
   ═════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NotificationPreferences } from '@/features/settings/types';
import {
  getNotificationPreferencesData,
  updateNotificationPreferencesData,
} from '@/features/settings/services';
import { defaultNotificationPreferences } from '@/features/settings/mocks';
import { useNotifications } from '@/hooks/useNotifications';

export interface UseNotificationPreferencesReturn {
  preferences: NotificationPreferences;
  loading: boolean;
  saving: boolean;
  update: (next: NotificationPreferences) => Promise<void>;
  toggle: (
    channel: keyof NotificationPreferences,
    key: string,
  ) => Promise<void>;
}

/** Gère les préférences de notifications avec feedback toast. */
export function useNotificationPreferences(): UseNotificationPreferencesReturn {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    defaultNotificationPreferences,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);
  const { success, error: toastError } = useNotifications();

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function load() {
      try {
        const loaded = await getNotificationPreferencesData();
        if (mountedRef.current && !cancelled) setPreferences(loaded);
      } finally {
        if (mountedRef.current && !cancelled) setLoading(false);
      }
    }
    void load();

    return () => {
      mountedRef.current = false;
      cancelled = true;
    };
  }, []);

  const update = useCallback(
    async (next: NotificationPreferences) => {
      setSaving(true);
      try {
        const saved = await updateNotificationPreferencesData(next);
        setPreferences(saved);
        success('Préférences de notifications enregistrées');
      } catch {
        toastError('Erreur lors de l’enregistrement des préférences');
      } finally {
        setSaving(false);
      }
    },
    [success, toastError],
  );

  const toggle = useCallback(
    async (channel: keyof NotificationPreferences, key: string) => {
      const current = { ...preferences };
      const channelValue = {
        ...(current[channel] as unknown as Record<string, boolean>),
      };
      channelValue[key] = !channelValue[key];
      const next = {
        ...current,
        [channel]: channelValue,
      } as NotificationPreferences;
      await update(next);
    },
    [preferences, update],
  );

  return useMemo(
    () => ({ preferences, loading, saving, update, toggle }),
    [preferences, loading, saving, update, toggle],
  );
}

