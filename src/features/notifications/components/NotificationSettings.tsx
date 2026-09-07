/* ═════════════════════════════════════════════════════════════════════
   Notifications — NotificationSettings
   Full settings panel for notification preferences
   ═════════════════════════════════════════════════════════════════════ */

import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  Mail,
  Smartphone,
  Monitor,
  MessageSquare,
  Target,
  GitBranch,
  ListTodo,
  Calendar,
  BarChart3,
  Megaphone,
  AtSign,
  ShieldAlert,
  Clock,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { backdropVariants } from '@/lib/motion-variants';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '@/features/notifications/services/notifications.service';
import type { NotificationSettings as NotificationSettingsType } from '@/types/notification.types';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  open: boolean;
  onClose: () => void;
}

/* ── Channel settings ── */
interface ChannelSetting {
  key: keyof NotificationSettingsType;
  label: string;
  icon: typeof Bell;
  description: string;
}

const channelSettings: ChannelSetting[] = [
  { key: 'email', label: 'Email', icon: Mail, description: 'Recevoir les notifications par email' },
  { key: 'push', label: 'Push', icon: Smartphone, description: 'Notifications push sur mobile' },
  { key: 'desktop', label: 'Desktop', icon: Monitor, description: 'Notifications sur le bureau' },
  { key: 'sms', label: 'SMS', icon: MessageSquare, description: 'Notifications par SMS' },
];

/* ── Module settings ── */
interface ModuleSetting {
  key: keyof NotificationSettingsType;
  label: string;
  icon: typeof Bell;
  description: string;
}

const moduleSettings: ModuleSetting[] = [
  { key: 'lead', label: 'Leads', icon: Target, description: 'Création et modification de leads' },
  { key: 'pipeline', label: 'Pipeline', icon: GitBranch, description: 'Mouvements dans le pipeline' },
  { key: 'tasks', label: 'Tâches', icon: ListTodo, description: 'Attribution et rappels de tâches' },
  { key: 'meetings', label: 'Réunions', icon: Calendar, description: 'Invitations et rappels de réunions' },
  { key: 'reports', label: 'Rapports', icon: BarChart3, description: 'Rapports générés et prêts' },
  { key: 'marketing', label: 'Marketing', icon: Megaphone, description: 'Campagnes et communications marketing' },
  { key: 'mentions', label: 'Mentions', icon: AtSign, description: 'Mentions et commentaires' },
  { key: 'systemAlerts', label: 'Système', icon: ShieldAlert, description: 'Alertes système et sécurité' },
];

export const NotificationSettings = memo(function NotificationSettings({
  open,
  onClose,
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { success: showSuccess, error: showError } = useNotifications();

  useEffect(() => {
    if (open) {
      setSuccess(false);
      getNotificationSettings().then((s) => {
        setSettings(s);
        setLoading(false);
      });
    }
  }, [open]);

  const handleToggle = useCallback(
    (key: keyof NotificationSettingsType) => {
      if (!settings) return;
      setSettings((prev) =>
        prev ? { ...prev, [key]: !prev[key] as boolean } : prev,
      );
    },
    [settings],
  );

  const handleSave = useCallback(async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateNotificationSettings(settings);
      setSuccess(true);
      showSuccess('Préférences de notification mises à jour');
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      showError('Erreur lors de la sauvegarde des préférences');
    } finally {
      setSaving(false);
    }
  }, [settings, showSuccess, showError]);

  if (!settings) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-overlay"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-border bg-surface shadow-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Paramètres de notification"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-text-primary">Paramètres</h2>
                  <p className="text-[12px] text-text-tertiary">Préférences de notification</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
                aria-label="Fermer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Success alert */}
              {success && (
                <Alert variant="success" dismissible onDismiss={() => setSuccess(false)}>
                  Vos préférences ont été sauvegardées avec succès.
                </Alert>
              )}

              {/* ── Channels ── */}
              <Card variant="outlined">
                <CardContent className="p-5">
                  <CardHeader className="mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="size-4 text-accent" />
                      Canaux de notification
                    </CardTitle>
                    <p className="text-[12px] text-text-tertiary mt-1">
                      Choisissez comment vous souhaitez être notifié
                    </p>
                  </CardHeader>

                  <div className="space-y-4">
                    {channelSettings.map((channel) => (
                      <div
                        key={channel.key}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-surface-hover text-text-tertiary">
                            <channel.icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-text-primary">
                              {channel.label}
                            </p>
                            <p className="text-[11px] text-text-tertiary">
                              {channel.description}
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={settings[channel.key] as boolean}
                          onChange={() => handleToggle(channel.key)}
                          aria-label={`Activer ${channel.label}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ── Modules ── */}
              <Card variant="outlined">
                <CardContent className="p-5">
                  <CardHeader className="mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-4 text-accent" />
                      Modules CRM
                    </CardTitle>
                    <p className="text-[12px] text-text-tertiary mt-1">
                      Activer ou désactiver les notifications par module
                    </p>
                  </CardHeader>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {moduleSettings.map((module) => (
                      <div
                        key={module.key}
                        className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3"
                      >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-accent-subtle text-accent shrink-0">
                          <module.icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-medium text-text-primary">
                              {module.label}
                            </p>
                            <Checkbox
                              checked={settings[module.key] as boolean}
                              onChange={() => handleToggle(module.key)}
                              aria-label={`Activer ${module.label}`}
                            />
                          </div>
                          <p className="mt-0.5 text-[11px] text-text-tertiary">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ── Advanced ── */}
              <Card variant="outlined">
                <CardContent className="p-5">
                  <CardHeader className="mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="size-4 text-accent" />
                      Paramètres avancés
                    </CardTitle>
                  </CardHeader>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
                        Fréquence du digest
                      </label>
                      <Select
                        value={settings.digestFrequency}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  digestFrequency: e.target.value as 'instant' | 'daily' | 'weekly',
                                }
                              : prev,
                          )
                        }
                        options={[
                          { label: 'Instantané', value: 'instant' },
                          { label: 'Quotidien', value: 'daily' },
                          { label: 'Hebdomadaire', value: 'weekly' },
                        ]}
                        aria-label="Fréquence du digest"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">
                          Heures silencieuses
                        </p>
                        <p className="text-[11px] text-text-tertiary">
                          Ne pas recevoir de notifications pendant ces heures
                        </p>
                      </div>
                      <Checkbox
                        checked={settings.quietHoursEnabled}
                        onChange={() => handleToggle('quietHoursEnabled')}
                        aria-label="Activer les heures silencieuses"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── Save button ── */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={onClose}>
                  Annuler
                </Button>
                <Button onClick={handleSave} loading={saving}>
                  <Save className="size-4" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

