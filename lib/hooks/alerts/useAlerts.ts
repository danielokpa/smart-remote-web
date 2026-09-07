"use client";

import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { alertsApi } from "@/lib/api/alerts/alerts";

import type {
  Alert,
  AlertStatus,
  GetAlertsParams,
} from "@/lib/types/alerts/alerts";

/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

export const alertKeys = {
  all: ["alerts"] as const,

  lists: () => [
    ...alertKeys.all,
    "list",
  ] as const,

  list: (params?: GetAlertsParams) => [
    ...alertKeys.lists(),
    params ?? {},
  ] as const,

  details: () => [
    ...alertKeys.all,
    "detail",
  ] as const,

  detail: (id: string) => [
    ...alertKeys.details(),
    id,
  ] as const,
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_LIMIT = 20;

/* -------------------------------------------------------------------------- */
/* Options                                                                    */
/* -------------------------------------------------------------------------- */

export interface UseAlertsOptions
  extends Omit<GetAlertsParams, "cursor"> {
  enabled?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Get all alerts                                                             */
/* -------------------------------------------------------------------------- */

export function useAlerts(
  options: UseAlertsOptions = {}
) {
  const {
    patientId,
    status,
    limit = DEFAULT_LIMIT,
    enabled = true,
  } = options;

  const query = useInfiniteQuery({
    queryKey: alertKeys.list({
      patientId,
      status,
      limit,
    }),

    initialPageParam:
      undefined as string | undefined,

    queryFn: ({ pageParam }) =>
      alertsApi.list({
        patientId,
        status,
        limit,
        cursor: pageParam,
      }),

    getNextPageParam: (lastPage) => {
      if (
        !lastPage.pagination.hasNextPage
      ) {
        return undefined;
      }

      return (
        lastPage.pagination.nextCursor ??
        undefined
      );
    },

    enabled,

    staleTime: 15 * 1000,

    refetchOnWindowFocus: true,
  });

  /* ------------------------------------------------------------------------ */
  /* Flatten all loaded pages                                                */
  /* ------------------------------------------------------------------------ */

  const alerts: Alert[] =
    query.data?.pages.flatMap(
      (page) => page.items
    ) ?? [];

  /* ------------------------------------------------------------------------ */
  /* Latest pagination information                                           */
  /* ------------------------------------------------------------------------ */

  const latestPage =
    query.data?.pages[
      query.data.pages.length - 1
    ];

  return {
    alerts,

    pages: query.data?.pages ?? [],

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isFetchingNextPage:
      query.isFetchingNextPage,

    hasNextPage: query.hasNextPage,

    fetchNextPage: query.fetchNextPage,

    refetch: query.refetch,

    isError: query.isError,

    error: query.error,

    isSuccess: query.isSuccess,

    pagination:
      latestPage?.pagination ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/* Optional: Get one alert                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Keep this hook only if/when GET /alerts/:id
 * is officially available on the backend.
 */
export function useAlert(
  id: string | undefined
) {
  const query = useQuery<Alert, Error>({
    queryKey: id
      ? alertKeys.detail(id)
      : alertKeys.details(),

    queryFn: async () => {
      if (!id) {
        throw new Error(
          "Alert ID is required."
        );
      }

      return alertsApi.getById(id);
    },

    enabled: Boolean(id),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });

  return {
    alert: query.data ?? null,

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isError: query.isError,

    error: query.error,

    isSuccess: query.isSuccess,

    refetch: query.refetch,
  };
}