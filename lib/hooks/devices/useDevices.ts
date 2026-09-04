"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { devicesApi } from "@/lib/api/devices/api";

import type {
  GetDevicesParams,
  RegisterDevicePayload,
  UpdateDevicePayload,
} from "@/lib/types/devices/types";

/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

export const deviceKeys = {
  all: ["devices"] as const,

  lists: () =>
    [...deviceKeys.all, "list"] as const,

  list: (params: GetDevicesParams) =>
    [
      ...deviceKeys.lists(),
      params,
    ] as const,

  details: () =>
    [...deviceKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...deviceKeys.details(),
      id,
    ] as const,
};

/* -------------------------------------------------------------------------- */
/* Devices hook                                                               */
/* -------------------------------------------------------------------------- */

export function useDevices(
  params: GetDevicesParams = {}
) {
  const queryClient =
    useQueryClient();

  /* ------------------------------------------------------------------------ */
  /* Get devices                                                              */
  /* GET /devices                                                             */
  /* ------------------------------------------------------------------------ */

  const devicesQuery = useQuery({
    queryKey: deviceKeys.list(params),

    queryFn: () =>
      devicesApi.getAll(params),

    /*
     * Keeps the previous list visible while
     * a different search/cursor is loading.
     */
    placeholderData: keepPreviousData,
  });

  /* ------------------------------------------------------------------------ */
  /* Register device                                                          */
  /* POST /devices                                                            */
  /* ------------------------------------------------------------------------ */

  const registerMutation =
    useMutation({
      mutationFn: (
        payload: RegisterDevicePayload
      ) =>
        devicesApi.register(
          payload
        ),

      onSuccess: () => {
        /*
         * Refresh every cached device list.
         *
         * This handles:
         * - current search
         * - previous searches
         * - different cursors
         * - different limits
         */
        queryClient.invalidateQueries({
          queryKey: deviceKeys.lists(),
        });
      },
    });

  /* ------------------------------------------------------------------------ */
  /* Update device                                                            */
  /* PATCH /devices/:id                                                       */
  /* ------------------------------------------------------------------------ */

  const updateMutation =
    useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: UpdateDevicePayload;
      }) =>
        devicesApi.update(
          id,
          payload
        ),

      onSuccess: (
        updatedDevice
      ) => {
        /*
         * If this device has ever been
         * fetched individually, immediately
         * update its cached detail.
         */
        queryClient.setQueryData(
          deviceKeys.detail(
            updatedDevice.id
          ),
          updatedDevice
        );

        /*
         * Refresh all list queries because
         * the device name/status may have changed.
         */
        queryClient.invalidateQueries({
          queryKey: deviceKeys.lists(),
        });
      },
    });

  /* ------------------------------------------------------------------------ */
  /* Delete device                                                            */
  /* DELETE /devices/:id                                                      */
  /* ------------------------------------------------------------------------ */

  const deleteMutation =
    useMutation({
      mutationFn: (
        id: string
      ) =>
        devicesApi.delete(id),

      onSuccess: (
        _deleted,
        deletedDeviceId
      ) => {
        /*
         * Remove the individual device from
         * the React Query cache if it exists.
         */
        queryClient.removeQueries({
          queryKey:
            deviceKeys.detail(
              deletedDeviceId
            ),
        });

        /*
         * Refresh the device list so the
         * deleted device disappears and
         * pagination remains consistent
         * with the backend.
         */
        queryClient.invalidateQueries({
          queryKey: deviceKeys.lists(),
        });
      },
    });

  /* ------------------------------------------------------------------------ */
  /* Return API                                                               */
  /* ------------------------------------------------------------------------ */

  return {
    /* ---------------------------------------------------------------------- */
    /* List data                                                               */
    /* ---------------------------------------------------------------------- */

    devices:
      devicesQuery.data?.items ?? [],

    pagination:
      devicesQuery.data?.pagination ?? {
        limit:
          params.limit ?? 20,
        hasNextPage: false,
        nextCursor: null,
      },

    /* ---------------------------------------------------------------------- */
    /* List query state                                                        */
    /* ---------------------------------------------------------------------- */

    isLoading:
      devicesQuery.isLoading,

    isFetching:
      devicesQuery.isFetching,

    isError:
      devicesQuery.isError,

    error:
      devicesQuery.error,

    devicesQuery,

    /* ---------------------------------------------------------------------- */
    /* Register                                                               */
    /* ---------------------------------------------------------------------- */

    registerDevice:
      registerMutation.mutateAsync,

    isRegistering:
      registerMutation.isPending,

    registerError:
      registerMutation.error,

    registerMutation,

    /* ---------------------------------------------------------------------- */
    /* Update                                                                 */
    /* ---------------------------------------------------------------------- */

    updateDevice:
      updateMutation.mutateAsync,

    isUpdating:
      updateMutation.isPending,

    updateError:
      updateMutation.error,

    updateMutation,

    /* ---------------------------------------------------------------------- */
    /* Delete                                                                 */
    /* ---------------------------------------------------------------------- */

    deleteDevice:
      deleteMutation.mutateAsync,

    isDeleting:
      deleteMutation.isPending,

    deleteError:
      deleteMutation.error,

    deleteMutation,

    /* ---------------------------------------------------------------------- */
    /* Manual refresh                                                         */
    /* ---------------------------------------------------------------------- */

    refetch:
      devicesQuery.refetch,
  };
}

export function useAvailableDevices() {
  const query = useQuery({
    queryKey: ["devices", "available"],

    queryFn: () => devicesApi.getAvailable(),

    staleTime: 60 * 1000,

    refetchOnWindowFocus: true,
  });

  return {
    devices: query.data?.items ?? [],

    pagination:
      query.data?.pagination ?? {
        limit: 20,
        hasNextPage: false,
        nextCursor: null,
      },

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isError: query.isError,

    error: query.error,

    refetch: query.refetch,
  };
}