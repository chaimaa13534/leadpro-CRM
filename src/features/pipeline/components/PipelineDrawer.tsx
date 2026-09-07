/**
 * Drawer latéral de détail rapide pour une opportunité.
 * S'affiche sans quitter le Pipeline Kanban.
 * Affiche le résumé, l'entreprise, le contact, l'historique, les notes, documents et activités.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Opportunity } from '@/types/opportunity.types';
import type { PipelineQuickDetails } from '@/features/pipeline/mocks/pipeline.mock';
import { getPipelineQuickDetails } from '@/features/pipeline/mocks/pipeline.mock';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/icons';
import { PipelineBadge } from './PipelineBadge';
import { PipelineValue } from './PipelineValue';
import { Progress } from '@/components/ui/Progress';

interface PipelineDrawerProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

type DrawerTab = 'summary' | 'history' | 'notes' | 'documents' | 'activity';

export function PipelineDrawer({ opportunity, isOpen, onClose }: PipelineDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('summary');
  const [details, setDetails] = useState<PipelineQuickDetails | null>(null);

  useEffect(() => {
    if (opportunity) {
      setDetails(getPipelineQuickDetails(opportunity));
      setActiveTab('summary');
    }
  }, [opportunity]);

  const tabs: Array<{ id: DrawerTab; label: string; icon: React.ReactNode }> = useMemo(
    () => [
      { id: 'summary', label: 'Résumé', icon: <Icons.file className="h-3.5 w-3.5" /> },
      { id: 'notes', label: 'Notes', icon: <Icons.note className="h-3.5 w-3.5" /> },
      { id: 'history', label: 'Historique', icon: <Icons.history className="h-3.5 w-3.5" /> },
      { id: 'documents', label: 'Documents', icon: <Icons.file className="h-3.5 w-3.5" /> },
      { id: 'activity', label: 'Activité', icon: <Icons.activity className="h-3.5 w-3.5" /> },
    ],
    [],
  );

  if (!opportunity) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-overlay/30"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-surface shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Détails de ${opportunity.name}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-semibold text-text-primary truncate">
                  {opportunity.name}
                </h3>
                <p className="text-[12px] text-text-tertiary truncate">
                  {opportunity.companyName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
                aria-label="Fermer"
              >
                <Icons.close className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col h-[calc(100%-60px)]">
              {/* Quick info cards */}
              <div className="grid grid-cols-2 gap-3 p-5">
                <div className="rounded-lg bg-background-secondary p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary mb-1">Valeur</p>
                  <PipelineValue amount={opportunity.amount} currency={opportunity.currency} size="md" />
                </div>
                <div className="rounded-lg bg-background-secondary p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary mb-1">Probabilité</p>
                  <span className="text-[14px] font-semibold tabular-nums text-text-primary">
                    {opportunity.probability}%
                  </span>
                </div>
                <div className="rounded-lg bg-background-secondary p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary mb-1">Priorité</p>
                  <PipelineBadge type="priority" value={opportunity.priority} />
                </div>
                <div className="rounded-lg bg-background-secondary p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary mb-1">Clôture</p>
                  <span className="text-[12px] font-medium text-text-primary">
                    {opportunity.expectedCloseDate
                      ? formatDate(opportunity.expectedCloseDate, 'short')
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Probability bar */}
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-text-secondary">Progression</span>
                  <span className="text-[11px] tabular-nums text-text-tertiary">{opportunity.probability}%</span>
                </div>
                <Progress value={opportunity.probability} size="md" variant="accent" />
              </div>

              {/* Tags */}
              {opportunity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-5 pb-4">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="neutral" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-b border-border px-5 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-accent text-text-primary'
                        : 'border-transparent text-text-tertiary hover:text-text-secondary',
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'summary' && details && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-[12px] font-semibold text-text-secondary mb-2">Résumé</h4>
                      <p className="text-[13px] text-text-primary leading-relaxed">{details.summary}</p>
                    </div>
                    <div>
                      <h4 className="text-[12px] font-semibold text-text-secondary mb-2">Contact</h4>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-[11px] font-semibold">
                          {details.contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-text-primary">{details.contact.name}</p>
                          {details.contact.email && (
                            <p className="text-[11px] text-text-tertiary">{details.contact.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[12px] font-semibold text-text-secondary mb-2">Entreprise</h4>
                      <p className="text-[13px] text-text-primary">{details.company.name}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && details && (
                  <div className="flex flex-col gap-3">
                    {details.notes.map((note, idx) => (
                      <div key={idx} className="rounded-lg bg-background-secondary p-3">
                        <p className="text-[12px] text-text-primary leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'history' && details && (
                  <div className="flex flex-col gap-3">
                    {details.history.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                          <Icons.statusChange className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-text-primary">
                            <span className="font-medium">{entry.field}</span> modifié
                          </p>
                          <p className="text-[11px] text-text-tertiary">
                            {formatDate(entry.changedAt, 'datetime')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'documents' && details && (
                  <div className="flex flex-col gap-2">
                    {details.documents.length === 0 ? (
                      <p className="text-[13px] text-text-tertiary text-center py-8">Aucun document</p>
                    ) : (
                      details.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-surface-hover transition-colors">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background-tertiary">
                            <Icons.file className="h-4 w-4 text-text-tertiary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-text-primary truncate">{doc.name}</p>
                            <p className="text-[11px] text-text-tertiary">{doc.type} · {doc.size ? `${(doc.size / 1024).toFixed(0)} Ko` : '—'}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'activity' && details && (
                  <div className="flex flex-col gap-3">
                    {details.activities.length === 0 ? (
                      <p className="text-[13px] text-text-tertiary text-center py-8">Aucune activité</p>
                    ) : (
                      details.activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-3">
                          <div className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                            act.type === 'call' ? 'bg-success-50 text-success-600' :
                            act.type === 'email' ? 'bg-info-50 text-info-600' :
                            act.type === 'meeting' ? 'bg-warning-50 text-warning-600' :
                            'bg-background-tertiary text-text-tertiary',
                          )}>
                            <Icons.activity className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-text-primary">{act.title}</p>
                            {act.description && (
                              <p className="text-[11px] text-text-tertiary mt-0.5">{act.description}</p>
                            )}
                            <p className="text-[10px] text-text-disabled mt-1">
                              {formatDate(act.createdAt, 'datetime')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

