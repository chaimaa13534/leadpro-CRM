import { useCallback, useEffect, useState } from 'react';
import type { Lead } from '@/types/lead.types';
import { getLeadById } from '@/services/lead.service';

export type LeadDetailsStatus = 'loading' | 'success' | 'not_found' | 'error';

/**
 * Charge un lead par identifiant (simulé, voir `leadService.getLeadById`).
 * Distingue explicitement "introuvable" (id inconnu, mais requête
 * réussie) d'une véritable "erreur" (requête échouée) — deux états très
 * différents à l'écran (voir `LeadDetailsPage`).
 */
export function useLeadDetails(leadId: string | undefined) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState<LeadDetailsStatus>(() =>
    leadId ? 'loading' : 'not_found',
  );

  const fetchLead = useCallback(() => {
    if (!leadId) {
      return Promise.resolve();
    }

    return getLeadById(leadId)
      .then((result) => {
        if (result) {
          setLead(result);
          setStatus('success');
        } else {
          setStatus('not_found');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [leadId]);

  // Ne déclenche la récupération que si un identifiant existe — sinon,
  // l'état initial paresseux ('not_found') suffit déjà, aucun appel
  // supplémentaire n'est nécessaire.
  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId, fetchLead]);

  const retry = useCallback(() => {
    setStatus('loading');
    return fetchLead();
  }, [fetchLead]);

  return { lead, status, retry };
}
