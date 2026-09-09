"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { devicesApi } from "@/lib/api/devices/api";

import type {
  AuthScope,
} from "@/lib/types/auth/types";

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

  lists: (authScope: AuthScope) =>
    [
      ...deviceKeys.all,
      authScope,
      "list",
    ] as const,

  list: (
    authScope: AuthScope,
    params: GetDevicesParams
  ) =>
    [
      ...deviceKeys.lists(authScope),
      params,
    ] as const,

  details: (authScope: AuthScope) =>
    [
      ...deviceKeys.all,
      authScope,
      "detail",
    ] as const,

  detail: (
    authScope: AuthScope,
    id: string
  ) =>
    [
      ...deviceKeys.details(authScope),
      id,
    ] as const,
};

/* -------------------------------------------------------------------------- */
/* Devices hook                                                               */
/* -------------------------------------------------------------------------- */

export function useDevices(
  params: GetDevicesParams = {},
  authScope: AuthScope
) {
  const queryClient =
    useQueryClient();

  /* ------------------------------------------------------------------------ */
  /* Get devices                                                              */
  /* ------------------------------------------------------------------------ */

  const devicesQuery = useQuery({
    queryKey:
      deviceKeys.list(
        authScope,
        params
      ),

    queryFn: () =>
      devicesApi.getAll(
        params,
        authScope
      ),

    placeholderData:
      keepPreviousData,
  });

  /* ------------------------------------------------------------------------ */
  /* Register device                                                          */
  /* STAFF ONLY                                                               */
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
        queryClient.invalidateQueries({
          queryKey:
            deviceKeys.lists(
              "STAFF"
            ),
        });
      },
    });

  /* ------------------------------------------------------------------------ */
  /* Update device                                                            */
  /* STAFF ONLY                                                               */
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
        queryClient.setQueryData(
          deviceKeys.detail(
            "STAFF",
            updatedDevice.id
          ),
          updatedDevice
        );

        queryClient.invalidateQueries({
          queryKey:
            deviceKeys.lists(
              "STAFF"
            ),
        });

        /*
         * Patient device lists may also
         * contain this device.
         *
         * Invalidate them too.
         */
        queryClient.invalidateQueries({
          queryKey:
            deviceKeys.lists(
              "PATIENT"
            ),
        });
      },
    });

  /* ------------------------------------------------------------------------ */
  /* Delete device                                                            */
  /* STAFF ONLY                                                               */
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
        queryClient.removeQueries({
          queryKey:
            deviceKeys.detail(
              "STAFF",
              deletedDeviceId
            ),
        });

        queryClient.removeQueries({
          queryKey:
            deviceKeys.detail(
              "PATIENT",
              deletedDeviceId
            ),
        });

        queryClient.invalidateQueries({
          queryKey:
            deviceKeys.lists(
              "STAFF"
            ),
        });

        queryClient.invalidateQueries({
          queryKey:
            deviceKeys.lists(
              "PATIENT"
            ),
        });
      },
    });

  return {
    devices:
      devicesQuery.data?.items ?? [],

    pagination:
      devicesQuery.data?.pagination ?? {
        limit:
          params.limit ?? 20,
        hasNextPage: false,
        nextCursor: null,
      },

    isLoading:
      devicesQuery.isLoading,

    isFetching:
      devicesQuery.isFetching,

    isError:
      devicesQuery.isError,

    error:
      devicesQuery.error,

    devicesQuery,

    registerDevice:
      registerMutation.mutateAsync,

    isRegistering:
      registerMutation.isPending,

    registerError:
      registerMutation.error,

    registerMutation,

    updateDevice:
      updateMutation.mutateAsync,

    isUpdating:
      updateMutation.isPending,

    updateError:
      updateMutation.error,

    updateMutation,

    deleteDevice:
      deleteMutation.mutateAsync,

    isDeleting:
      deleteMutation.isPending,

    deleteError:
      deleteMutation.error,

    deleteMutation,

    refetch:
      devicesQuery.refetch,
  };
}

/* -------------------------------------------------------------------------- */
/* Available devices                                                          */
/* -------------------------------------------------------------------------- */

export function useAvailableDevices(
  authScope: AuthScope
) {
  const query = useQuery({
    queryKey: [
      ...deviceKeys.all,
      authScope,
      "available",
    ] as const,

    queryFn: () =>
      devicesApi.getAvailable(
        authScope
      ),

    staleTime:
      60 * 1000,

    refetchOnWindowFocus:
      true,
  });

  return {
    devices:
      query.data?.items ?? [],

    pagination:
      query.data?.pagination ?? {
        limit: 20,
        hasNextPage: false,
        nextCursor: null,
      },

    isLoading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    refetch:
      query.refetch,
  };
}