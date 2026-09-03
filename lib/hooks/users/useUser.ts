"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { usersApi } from "@/lib/api/users/api";

import {
  userKeys,
} from "@/lib/hooks/users/useUsers";

import type {
  UpdateUserPayload,
} from "@/lib/types/users/types";

export function useUser(
  userId?: string
) {
  const queryClient =
    useQueryClient();

  /**
   * Get individual user
   */
  const userQuery = useQuery({
    queryKey: userKeys.detail(
      userId ?? ""
    ),

    queryFn: () =>
      usersApi.getById(
        userId!
      ),

    enabled: Boolean(userId),
  });

  /**
   * Update this user
   */
  const updateMutation = useMutation({
    mutationFn: (
      payload: UpdateUserPayload
    ) => {
      if (!userId) {
        throw new Error(
          "User ID is required to update a user."
        );
      }

      return usersApi.update(
        userId,
        payload
      );
    },

    onSuccess: (updatedUser) => {
      /**
       * Update the individual user cache
       * immediately.
       */
      queryClient.setQueryData(
        userKeys.detail(
          updatedUser.id
        ),
        updatedUser
      );

      /**
       * Refresh all cached user lists.
       */
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });

  /**
   * Delete this user
   */
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error(
          "User ID is required to delete a user."
        );
      }

      return usersApi.delete(
        userId
      );
    },

    onSuccess: (deleted) => {
      if (!deleted || !userId) {
        return;
      }

      /**
       * Remove the deleted user's
       * detail cache.
       */
      queryClient.removeQueries({
        queryKey: userKeys.detail(
          userId
        ),
      });

      /**
       * Refresh all user lists.
       */
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });

  return {
    /**
     * User
     */
    user:
      userQuery.data ?? null,

    /**
     * Query state
     */
    isLoading:
      userQuery.isLoading,

    isFetching:
      userQuery.isFetching,

    isError:
      userQuery.isError,

    error:
      userQuery.error,

    userQuery,

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
     * Refresh
     */
    refetch:
      userQuery.refetch,
  };
}