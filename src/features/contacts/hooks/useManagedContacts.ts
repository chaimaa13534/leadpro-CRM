import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createManagedContact,
  deleteManagedContact,
  getManagedContact,
  listManagedContacts,
  listOwnerOptions,
  updateManagedContact,
} from '../services/contact-management.service';
import type {
  CreateManagedContactInput,
  ManagedContact,
  ManagedContactsQuery,
  UpdateManagedContactInput,
} from '../types/contact-management.types';

export const managedContactsKeys = {
  all: ['managed-contacts'] as const,
  lists: () => [...managedContactsKeys.all, 'list'] as const,
  list: (query: ManagedContactsQuery) =>
    [...managedContactsKeys.lists(), query] as const,
  details: () => [...managedContactsKeys.all, 'detail'] as const,
  detail: (id: number) => [...managedContactsKeys.details(), id] as const,
  ownerOptions: () => [...managedContactsKeys.all, 'owner-options'] as const,
};

/** Fetch the paginated list of contacts for a given query. */
export function useManagedContacts(query: ManagedContactsQuery) {
  return useQuery({
    queryKey: managedContactsKeys.list(query),
    queryFn: () => listManagedContacts(query),
    placeholderData: (previous) => previous,
  });
}

/** Fetch a single contact by id (enabled only when an id is given). */
export function useManagedContact(id: number | null) {
  return useQuery({
    queryKey: managedContactsKeys.detail(id as number),
    queryFn: () => getManagedContact(id as number),
    enabled: id !== null,
  });
}

/** Fetch active users for the owner select. */
export function useOwnerOptions() {
  return useQuery({
    queryKey: managedContactsKeys.ownerOptions(),
    queryFn: listOwnerOptions,
    staleTime: 5 * 60 * 1000,
  });
}

/** Invalidate all managed-contacts queries after a successful mutation. */
function useInvalidateContacts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: managedContactsKeys.all });
  };
}

/** Create a new contact. */
export function useCreateManagedContact() {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (input: CreateManagedContactInput) => createManagedContact(input),
    onSuccess: invalidate,
  });
}

/** Update an existing contact. */
export function useUpdateManagedContact() {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateManagedContactInput;
    }) => updateManagedContact(id, input),
    onSuccess: invalidate,
  });
}

/** Soft-delete a contact. */
export function useDeleteManagedContact() {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (id: number) => deleteManagedContact(id),
    onSuccess: invalidate,
  });
}

/** Convenience helper to extract a contact from a cache entry. */
export function managedContactFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number,
): ManagedContact | undefined {
  const cached = queryClient.getQueryData<ManagedContact>(
    managedContactsKeys.detail(id),
  );
  return cached;
}
