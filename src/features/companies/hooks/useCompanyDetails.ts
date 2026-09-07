import { useCallback, useEffect, useState } from 'react';
import type { Company } from '@/types/company.types';
import { getCompanyById } from '@/services/company.service';

export type CompanyDetailsStatus =
  | 'loading'
  | 'success'
  | 'not_found'
  | 'error';

export function useCompanyDetails(companyId: string | undefined) {
  const [company, setCompany] = useState<Company | null>(null);
  const [status, setStatus] = useState<CompanyDetailsStatus>(() =>
    companyId ? 'loading' : 'not_found',
  );

  const fetchCompany = useCallback(() => {
    if (!companyId) {
      return Promise.resolve();
    }

    return getCompanyById(companyId)
      .then((result) => {
        if (result) {
          setCompany(result);
          setStatus('success');
        } else {
          setStatus('not_found');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      fetchCompany();
    }
  }, [companyId, fetchCompany]);

  const retry = useCallback(() => {
    setStatus('loading');
    return fetchCompany();
  }, [fetchCompany]);

  return { company, status, retry };
}

