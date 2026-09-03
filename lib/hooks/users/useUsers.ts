"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { usersApi } from "@/lib/api/users/api";

import type {
  GetUsersParams,
  UpdateUserPayload,
} from "@/lib/types/users/types";

export const userKeys = {
  all: ["users"] as const,

  lists: () =>
    [...userKeys.all, "list"] as const,

  list: (params: GetUsersParams) =>
    [...userKeys.lists(), params] as const,

  details: () =>
    [...userKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...userKeys.details(), id] as const,
};

export function useUsers(
  params: GetUsersParams = {}
) {
  const queryClient =
    useQueryClient();

  /**
   * Users list
   */
  const usersQuery = useQuery({
    queryKey: userKeys.list(params),

    queryFn: () =>
      usersApi.getAll(params),

    placeholderData: keepPreviousData,
  });

  /**
   * Update user
   */
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserPayload;
    }) =>
      usersApi.update(
        id,
        payload
      ),

    onSuccess: (updatedUser) => {
      /**
       * Immediately update the individual
       * user cache if it already exists.
       */
      queryClient.setQueryData(
        userKeys.detail(
          updatedUser.id
        ),
        updatedUser
      );

      /**
       * Refresh all user list queries.
       *
       * This is important because a user's
       * name or phone number may appear in
       * a filtered/search result.
       */
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });

  /**
   * Delete user
   */
  const deleteMutation = useMutation({
    mutationFn: (
      id: string
    ) =>
      usersApi.delete(id),

    onSuccess: (
      deleted,
      deletedUserId
    ) => {
      if (!deleted) {
        return;
      }

      /**
       * Remove the deleted user's
       * individual cache entry.
       */
      queryClient.removeQueries({
        queryKey: userKeys.detail(
          deletedUserId
        ),
      });

      /**
       * Refresh every cached users list.
       */
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });

  return {
    /**
     * List data
     */
    users:
      usersQuery.data?.items ?? [],

    pagination:
      usersQuery.data?.pagination ?? {
        limit: params.limit ?? 20,
        hasNextPage: false,
        nextCursor: null,
      },

    /**
     * Query state
     */
    isLoading:
      usersQuery.isLoading,

    isFetching:
      usersQuery.isFetching,

    isError:
      usersQuery.isError,

    error:
      usersQuery.error,

    usersQuery,

    /**
     * Update
     */
    updateUser:
      updateMutation.mutateAsync,

    isUpdating:
      updateMutation.isPending,

    updateError:
      updateMutation.error,

    /**
     * Delete
     */
    deleteUser:
      deleteMutation.mutateAsync,

    isDeleting:
      deleteMutation.isPending,

    deleteError:
      deleteMutation.error,

    /**
     * Manual refresh
     */
    refetch:
      usersQuery.refetch,
  };
}