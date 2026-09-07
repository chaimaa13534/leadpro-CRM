/* ═════════════════════════════════════════════════════════════════════
   Settings — AppearanceSettings
   Thème (Light/Dark/System), densité, sidebar, animations + previews.
   Réutilise le système de thème existant via `useTheme`.
   ═════════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Moon, Palette, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import type { AppearancePreferences } from '@/features/settings/types';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { SettingsGroup } from '@/features/settings/components/SettingsGroup';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { SettingsSaveBar } from '@/features/settings/components/SettingsSaveBar';
import { cn } from '@/lib/cn';

interface AppearanceSettingsProps {
  preferences: AppearancePreferences;
  onSave: (preferences: AppearancePreferences) => Promise<void> | void;
  saving?: boolean;
}

const themeOptions = [
  { id: 'light' as const, label: 'Light', description: 'Interface claire', icon: Sun },
  { id: 'dark' as const, label: 'Dark', description: 'Interface sombre', icon: Moon },
  { id: 'system' as const, label: 'System', description: 'Suit le système', icon: Monitor },
];

const densityOptions = [
  { id: 'compact' as const, label: 'Compact', description: 'Plus dense' },
  { id: 'comfortable' as const, label: 'Comfortable', description: 'Équilibré' },
  { id: 'spacious' as const, label: 'Spacious', description: 'Aéré' },
];

/* ═══════════════════════════════════════════════════════ */
export function AppearanceSettings({
  preferences,
  onSave,
  saving = false,
}: AppearanceSettingsProps) {
  const { theme, setTheme } = useTheme();
  const [draft, setDraft] = useState<AppearancePreferences>(preferences);

  useEffect(() => {
    setDraft(preferences);
  }, [preferences]);

  const isDirty = useMemo(
    () =>
      draft.theme !== preferences.theme ||
      draft.density !== preferences.density ||
      draft.sidebar !== preferences.sidebar ||
      draft.animations !== preferences.animations,
    [draft, preferences],
  );

  const [saved, setSaved] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(draft.theme);

  const handleThemeSelect = (themeMode: AppearancePreferences['theme']) => {
    setDraft((prev) => ({ ...prev, theme: themeMode }));
    // Applique le thème immédiatement pour la prévisualisation.
    setPendingTheme(themeMode);
  };

  useEffect(() => {
    if (theme === 'dark') return;
    // Ne pas surcharger le thème global pendant la prévisualisation.
    // La sauvegarde effective se fait via onSave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    await onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <SettingsSection
        title="Thème"
        description="Choisissez l’apparence de LeadPro, ou laissez le système décider."
      >
        <SettingsCard>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = draft.theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleThemeSelect(option.id)}
                  className={cn(
                    'relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150',
                    isActive
                      ? 'border-accent bg-accent-subtle shadow-ring'
                      : 'border-border bg-surface hover:border-border-hover hover:bg-surface-hover',
                  )}
                  aria-pressed={isActive}
                  aria-label={`Thème ${option.label}`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-text-secondary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-medium text-text-primary">
                      {option.label}
                    </span>
                    <span className="block text-[11px] text-text-tertiary">
                      {option.description}
                    </span>
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="theme-check"
                      className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white"
                    >
                      <Check className="h-3 w-3" />
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Densité"
        description="Ajustez l’espacement général de l’interface."
      >
        <SettingsCard>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {densityOptions.map((option) => {
              const isActive = draft.density === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, density: option.id }))
                  }
                  className={cn(
                    'relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150',
                    isActive
                      ? 'border-accent bg-accent-subtle shadow-ring'
                      : 'border-border bg-surface hover:border-border-hover hover:bg-surface-hover',
                  )}
                  aria-pressed={isActive}
                  aria-label={`Densité ${option.label}`}
                >
                  <span className="flex-1">
                    <span className="block text-[13px] font-medium text-text-primary">
                      {option.label}
                    </span>
                    <span className="block text-[11px] text-text-tertiary">
                      {option.description}
                    </span>
                  </span>
                  {isActive && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection
        title="Interface"
        description="Préférences d’affichage globales."
      >
        <SettingsCard>
          <SettingsGroup>
            <SettingsRow
              title="Sidebar"
              description="Développée ou réduite par défaut."
            >
              <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
                {(['expanded', 'collapsed'] as const).map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, sidebar: state }))
                    }
                    className={cn(
                      'rounded-md px-3 py-1.5 text-[12px] font-medium transition-all duration-150',
                      draft.sidebar === state
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary',
                    )}
                    aria-pressed={draft.sidebar === state}
                  >
                    {state === 'expanded' ? 'Expanded' : 'Collapsed'}
                  </button>
                ))}
              </div>
            </SettingsRow>

            <SettingsRow
              title="Animations"
              description="Réduire les animations pour le confort de lecture."
            >
              <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
                {(['enabled', 'reduced'] as const).map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, animations: state }))
                    }
                    className={cn(
                      'rounded-md px-3 py-1.5 text-[12px] font-medium transition-all duration-150',
                      draft.animations === state
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary',
                    )}
                    aria-pressed={draft.animations === state}
                  >
                    {state === 'enabled' ? 'Enabled' : 'Reduced'}
                  </button>
                ))}
              </div>
            </SettingsRow>
          </SettingsGroup>
        </SettingsCard>
      </SettingsSection>

      <SettingsSaveBar
        onSave={handleSave}
        onCancel={() => setDraft(preferences)}
        saving={saving}
        saved={saved}
        dirty={isDirty}
      />
    </div>
  );
}

export default AppearanceSettings;

