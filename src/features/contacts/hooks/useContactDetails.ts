import { useCallback, useEffect, useState } from 'react';
import type { Contact } from '@/types/contact.types';
import { getContactById } from '@/services/contact.service';

export type ContactDetailsStatus = 'loading' | 'success' | 'not_found' | 'error';

export function useContactDetails(contactId: string | undefined) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [status, setStatus] = useState<ContactDetailsStatus>(() =>
    contactId ? 'loading' : 'not_found',
  );

  const fetchContact = useCallback(() => {
    if (!contactId) {
      return Promise.resolve();
    }

    return getContactById(contactId)
      .then((result) => {
        if (result) {
          setContact(result);
          setStatus('success');
        } else {
          setStatus('not_found');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [contactId]);

  useEffect(() => {
    if (contactId) {
      fetchContact();
    }
  }, [contactId, fetchContact]);

  const retry = useCallback(() => {
    setStatus('loading');
    return fetchContact();
  }, [fetchContact]);

  return { contact, status, retry };
}

