/* ═════════════════════════════════════════════════════════════════════
   Settings — useSettingsData
   Charge les données de réglages (profil, organisation, compte,
   préférences) avec un état de chargement/erreur unifié.
   ═════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AccountInfo,
  AppearancePreferences,
  GeneralPreferences,
  Organization,
  UserProfile,
} from '@/features/settings/types';
import {
  getAccountInfo,
  getAppearance,
  getGeneralPreferences,
  getOrganization,
  getProfileSettings,
} from '@/features/settings/services';

export interface SettingsData {
  profile: UserProfile | null;
  organization: Organization | null;
  account: AccountInfo | null;
  preferences: GeneralPreferences | null;
  appearance: AppearancePreferences | null;
}

export interface UseSettingsDataReturn {
  data: SettingsData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Charge en parallèle les données de réglages. */
export function useSettingsData(): UseSettingsDataReturn {
  const [data, setData] = useState<SettingsData>({
    profile: null,
    organization: null,
    account: null,
    preferences: null,
    appearance: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profile, organization, account, preferences, appearance] =
        await Promise.all([
          getProfileSettings(),
          getOrganization(),
          getAccountInfo(),
          getGeneralPreferences(),
          getAppearance(),
        ]);

      if (mountedRef.current) {
        setData({ profile, organization, account, preferences, appearance });
      }
    } catch {
      if (mountedRef.current) {
        setError('Erreur lors du chargement des réglages.');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return useMemo(
    () => ({ data, loading, error, refresh }),
    [data, loading, error, refresh],
  );
}

