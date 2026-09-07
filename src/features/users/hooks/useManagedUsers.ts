import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  changeManagedUserStatus,
  createManagedUser,
  deleteManagedUser,
  getManagedUser,
  listManagedUsers,
  updateManagedUser,
} from '../services/user-management.service';
import type {
  CreateManagedUserInput,
  ManagedUser,
  ManagedUsersQuery,
  UpdateManagedUserInput,
} from '../types/user-management.types';

export const managedUsersKeys = {
  all: ['managed-users'] as const,
  lists: () => [...managedUsersKeys.all, 'list'] as const,
  list: (query: ManagedUsersQuery) =>
    [...managedUsersKeys.lists(), query] as const,
  details: () => [...managedUsersKeys.all, 'detail'] as const,
  detail: (id: number) => [...managedUsersKeys.details(), id] as const,
};

/** Fetch the paginated list of managed users for a given query. */
export function useManagedUsers(query: ManagedUsersQuery) {
  return useQuery({
    queryKey: managedUsersKeys.list(query),
    queryFn: () => listManagedUsers(query),
    placeholderData: (previous) => previous,
  });
}

/** Fetch a single managed user by id (enabled only when an id is given). */
export function useManagedUser(id: number | null) {
  return useQuery({
    queryKey: managedUsersKeys.detail(id as number),
    queryFn: () => getManagedUser(id as number),
    enabled: id !== null,
  });
}

/** Invalidate all managed-users queries after a successful mutation. */
function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: managedUsersKeys.all });
  };
}

/** Create a new user. */
export function useCreateManagedUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (input: CreateManagedUserInput) => createManagedUser(input),
    onSuccess: invalidate,
  });
}

/** Update an existing user. */
export function useUpdateManagedUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateManagedUserInput }) =>
      updateManagedUser(id, input),
    onSuccess: invalidate,
  });
}

/** Activate or deactivate a user. */
export function useChangeManagedUserStatus() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      changeManagedUserStatus(id, isActive),
    onSuccess: invalidate,
  });
}

/** Soft-delete a user. */
export function useDeleteManagedUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (id: number) => deleteManagedUser(id),
    onSuccess: invalidate,
  });
}

/** Convenience helper to extract a ManagedUser from a cache entry. */
export function managedUserFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number,
): ManagedUser | undefined {
  const cached = queryClient.getQueryData<ManagedUser>(
    managedUsersKeys.detail(id),
  );
  return cached;
}
