import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createManagedLead,
  deleteManagedLead,
  getManagedLead,
  listLeadSourceOptions,
  listManagedLeads,
  listOwnerOptions,
  updateManagedLead,
} from '../services/lead-management.service';
import type {
  CreateManagedLeadInput,
  ManagedLead,
  ManagedLeadsQuery,
  UpdateManagedLeadInput,
} from '../types/lead-management.types';

export const managedLeadsKeys = {
  all: ['managed-leads'] as const,
  lists: () => [...managedLeadsKeys.all, 'list'] as const,
  list: (query: ManagedLeadsQuery) =>
    [...managedLeadsKeys.lists(), query] as const,
  details: () => [...managedLeadsKeys.all, 'detail'] as const,
  detail: (id: number) => [...managedLeadsKeys.details(), id] as const,
  ownerOptions: () => [...managedLeadsKeys.all, 'owner-options'] as const,
  sourceOptions: () => [...managedLeadsKeys.all, 'source-options'] as const,
};

/** Fetch the paginated list of leads for a given query. */
export function useManagedLeads(query: ManagedLeadsQuery) {
  return useQuery({
    queryKey: managedLeadsKeys.list(query),
    queryFn: () => listManagedLeads(query),
    placeholderData: (previous) => previous,
  });
}

/** Fetch a single lead by id (enabled only when an id is given). */
export function useManagedLead(id: number | null) {
  return useQuery({
    queryKey: managedLeadsKeys.detail(id as number),
    queryFn: () => getManagedLead(id as number),
    enabled: id !== null,
  });
}

/** Fetch active users for the owner select. */
export function useOwnerOptions() {
  return useQuery({
    queryKey: managedLeadsKeys.ownerOptions(),
    queryFn: listOwnerOptions,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch lead sources for filters and form selects. */
export function useLeadSourceOptions() {
  return useQuery({
    queryKey: managedLeadsKeys.sourceOptions(),
    queryFn: listLeadSourceOptions,
    staleTime: 5 * 60 * 1000,
  });
}

/** Invalidate all managed-leads queries after a successful mutation. */
function useInvalidateLeads() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: managedLeadsKeys.all });
  };
}

/** Create a new lead. */
export function useCreateManagedLead() {
  const invalidate = useInvalidateLeads();
  return useMutation({
    mutationFn: (input: CreateManagedLeadInput) => createManagedLead(input),
    onSuccess: invalidate,
  });
}

/** Update an existing lead. */
export function useUpdateManagedLead() {
  const invalidate = useInvalidateLeads();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateManagedLeadInput;
    }) => updateManagedLead(id, input),
    onSuccess: invalidate,
  });
}

/** Soft-delete a lead. */
export function useDeleteManagedLead() {
  const invalidate = useInvalidateLeads();
  return useMutation({
    mutationFn: (id: number) => deleteManagedLead(id),
    onSuccess: invalidate,
  });
}

/** Convenience helper to extract a lead from a cache entry. */
export function managedLeadFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number,
): ManagedLead | undefined {
  const cached = queryClient.getQueryData<ManagedLead>(
    managedLeadsKeys.detail(id),
  );
  return cached;
}
