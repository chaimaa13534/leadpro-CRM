import { useCallback, useEffect, useState } from 'react';
import type { Opportunity } from '@/types/opportunity.types';
import { getOpportunityById } from '@/services/opportunity.service';

export type OpportunityDetailsStatus = 'loading' | 'success' | 'not_found' | 'error';

export function useOpportunityDetails(opportunityId: string | undefined) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [status, setStatus] = useState<OpportunityDetailsStatus>(() =>
    opportunityId ? 'loading' : 'not_found',
  );

  const fetchOpportunity = useCallback(() => {
    if (!opportunityId) {
      return Promise.resolve();
    }

    return getOpportunityById(opportunityId)
      .then((result) => {
        if (result) {
          setOpportunity(result);
          setStatus('success');
        } else {
          setStatus('not_found');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [opportunityId]);

  useEffect(() => {
    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId, fetchOpportunity]);

  const retry = useCallback(() => {
    setStatus('loading');
    return fetchOpportunity();
  }, [fetchOpportunity]);

  return { opportunity, status, retry };
}

