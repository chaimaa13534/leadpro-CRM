import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createManagedCompany,
  deleteManagedCompany,
  getCompanyFilterOptions,
  getManagedCompany,
  listManagedCompanies,
  updateManagedCompany,
} from '../services/company-management.service';
import type {
  CreateManagedCompanyInput,
  ManagedCompaniesQuery,
  ManagedCompany,
  UpdateManagedCompanyInput,
} from '../types/company-management.types';

export const managedCompaniesKeys = {
  all: ['managed-companies'] as const,
  lists: () => [...managedCompaniesKeys.all, 'list'] as const,
  list: (query: ManagedCompaniesQuery) =>
    [...managedCompaniesKeys.lists(), query] as const,
  details: () => [...managedCompaniesKeys.all, 'detail'] as const,
  detail: (id: number) => [...managedCompaniesKeys.details(), id] as const,
  filters: () => [...managedCompaniesKeys.all, 'filters'] as const,
};

/** Fetch the paginated list of companies for a given query. */
export function useManagedCompanies(query: ManagedCompaniesQuery) {
  return useQuery({
    queryKey: managedCompaniesKeys.list(query),
    queryFn: () => listManagedCompanies(query),
    placeholderData: (previous) => previous,
  });
}

/** Fetch a single company by id (enabled only when an id is given). */
export function useManagedCompany(id: number | null) {
  return useQuery({
    queryKey: managedCompaniesKeys.detail(id as number),
    queryFn: () => getManagedCompany(id as number),
    enabled: id !== null,
  });
}

/** Fetch the distinct filter values for the toolbar. */
export function useCompanyFilterOptions() {
  return useQuery({
    queryKey: managedCompaniesKeys.filters(),
    queryFn: getCompanyFilterOptions,
    staleTime: 5 * 60 * 1000,
  });
}

/** Invalidate all managed-companies queries after a successful mutation. */
function useInvalidateCompanies() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: managedCompaniesKeys.all });
  };
}

/** Create a new company. */
export function useCreateManagedCompany() {
  const invalidate = useInvalidateCompanies();
  return useMutation({
    mutationFn: (input: CreateManagedCompanyInput) =>
      createManagedCompany(input),
    onSuccess: invalidate,
  });
}

/** Update an existing company. */
export function useUpdateManagedCompany() {
  const invalidate = useInvalidateCompanies();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateManagedCompanyInput;
    }) => updateManagedCompany(id, input),
    onSuccess: invalidate,
  });
}

/** Soft-delete a company. */
export function useDeleteManagedCompany() {
  const invalidate = useInvalidateCompanies();
  return useMutation({
    mutationFn: (id: number) => deleteManagedCompany(id),
    onSuccess: invalidate,
  });
}

/** Convenience helper to extract a company from a cache entry. */
export function managedCompanyFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number,
): ManagedCompany | undefined {
  const cached = queryClient.getQueryData<ManagedCompany>(
    managedCompaniesKeys.detail(id),
  );
  return cached;
}
