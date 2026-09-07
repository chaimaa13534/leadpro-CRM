import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createManagedOpportunity, deleteManagedOpportunity, getManagedOpportunity, listCompanies, listContacts, listManagedOpportunities, listOpportunityFilters, listOwners, updateManagedOpportunity } from '../services/opportunity-management.service';
import type { CreateManagedOpportunityInput, ManagedOpportunitiesQuery, UpdateManagedOpportunityInput } from '../types/opportunity-management.types';
export const managedOpportunitiesKeys = { all: ['managed-opportunities'] as const, list: (q: ManagedOpportunitiesQuery) => [...managedOpportunitiesKeys.all, 'list', q] as const, detail: (id: number) => [...managedOpportunitiesKeys.all, 'detail', id] as const };
export function useOpportunities(query: ManagedOpportunitiesQuery) { return useQuery({ queryKey: managedOpportunitiesKeys.list(query), queryFn: () => listManagedOpportunities(query), placeholderData: (previous) => previous }); }
export function useOpportunity(id: number | null) { return useQuery({ queryKey: managedOpportunitiesKeys.detail(id ?? 0), queryFn: () => getManagedOpportunity(id as number), enabled: id !== null }); }
export function useOpportunityOptions() { return useQuery({ queryKey: [...managedOpportunitiesKeys.all, 'options'], queryFn: listOpportunityFilters, staleTime: 300000 }); }
export function useOpportunityOwners() { return useQuery({ queryKey: [...managedOpportunitiesKeys.all, 'owners'], queryFn: listOwners, staleTime: 300000 }); }
export function useOpportunityCompanies() { return useQuery({ queryKey: [...managedOpportunitiesKeys.all, 'companies'], queryFn: listCompanies, staleTime: 300000 }); }
export function useOpportunityContacts() { return useQuery({ queryKey: [...managedOpportunitiesKeys.all, 'contacts'], queryFn: listContacts, staleTime: 300000 }); }
function invalidate() { const client = useQueryClient(); return () => client.invalidateQueries({ queryKey: managedOpportunitiesKeys.all }); }
export function useCreateOpportunity() { const onSuccess = invalidate(); return useMutation({ mutationFn: (input: CreateManagedOpportunityInput) => createManagedOpportunity(input), onSuccess }); }
export function useUpdateOpportunity() { const onSuccess = invalidate(); return useMutation({ mutationFn: ({ id, input }: { id: number; input: UpdateManagedOpportunityInput }) => updateManagedOpportunity(id, input), onSuccess }); }
export function useDeleteOpportunity() { const onSuccess = invalidate(); return useMutation({ mutationFn: deleteManagedOpportunity, onSuccess }); }
