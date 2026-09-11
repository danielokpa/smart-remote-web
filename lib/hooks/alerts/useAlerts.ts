"use client";

import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { alertsApi } from "@/lib/api/alerts/alerts";

import type {
  Alert,
  GetAlertsParams,
} from "@/lib/types/alerts/alerts";

import type {
  AuthScope,
} from "@/lib/types/auth/types";

/* -------------------------------------------------------------------------- */
/* Query keys                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Alert query keys are scoped by authentication scope.
 *
 * This is important because STAFF and PATIENT can both
 * request /alerts, but they must never share the same
 * React Query cache.
 *
 * Example:
 *
 * ["alerts", "STAFF", "list", {...}]
 * ["alerts", "PATIENT", "list", {...}]
 *
 * and:
 *
 * ["alerts", "STAFF", "detail", alertId]
 * ["alerts", "PATIENT", "detail", alertId]
 */
export const alertKeys = {
  all: ["alerts"] as const,

  lists: (
    authScope: AuthScope
  ) =>
    [
      ...alertKeys.all,
      authScope,
      "list",
    ] as const,

  list: (
    authScope: AuthScope,
    params?: GetAlertsParams
  ) =>
    [
      ...alertKeys.lists(authScope),
      params ?? {},
    ] as const,

  details: (
    authScope: AuthScope
  ) =>
    [
      ...alertKeys.all,
      authScope,
      "detail",
    ] as const,

  detail: (
    authScope: AuthScope,
    id: string
  ) =>
    [
      ...alertKeys.details(authScope),
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

/**
 * Fetch paginated alerts using the authentication
 * token belonging to the supplied auth scope.
 *
 * STAFF:
 *   Uses remote_care_staff_auth_token
 *
 * PATIENT:
 *   Uses remote_care_patient_auth_token
 */
export function useAlerts(
  authScope: AuthScope,
  options: UseAlertsOptions = {}
) {
  const {
    patientId,
    status,
    limit = DEFAULT_LIMIT,
    enabled = true,
  } = options;

  const query = useInfiniteQuery({
    /* ---------------------------------------------------------------------- */
    /* Scoped query key                                                       */
    /* ---------------------------------------------------------------------- */

    queryKey: alertKeys.list(
      authScope,
      {
        patientId,
        status,
        limit,
      }
    ),

    /* ---------------------------------------------------------------------- */
    /* Cursor                                                                 */
    /* ---------------------------------------------------------------------- */

    initialPageParam:
      undefined as string | undefined,

    /* ---------------------------------------------------------------------- */
    /* Request                                                                */
    /* ---------------------------------------------------------------------- */

    queryFn: ({ pageParam }) =>
      alertsApi.list(
        {
          patientId,
          status,
          limit,
          cursor: pageParam,
        },
        authScope
      ),

    /* ---------------------------------------------------------------------- */
    /* Cursor pagination                                                      */
    /* ---------------------------------------------------------------------- */

    getNextPageParam: (
      lastPage
    ) => {
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
  /* Flatten loaded pages                                                    */
  /* ------------------------------------------------------------------------ */

  const alerts: Alert[] =
    query.data?.pages.flatMap(
      (page) => page.items
    ) ?? [];

  /* ------------------------------------------------------------------------ */
  /* Latest pagination                                                        */
  /* ------------------------------------------------------------------------ */

  const latestPage =
    query.data?.pages[
      query.data.pages.length - 1
    ];

  /* ------------------------------------------------------------------------ */
  /* Return                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    alerts,

    pages:
      query.data?.pages ?? [],

    isLoading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isFetchingNextPage:
      query.isFetchingNextPage,

    hasNextPage:
      query.hasNextPage,

    fetchNextPage:
      query.fetchNextPage,

    refetch:
      query.refetch,

    isError:
      query.isError,

    error:
      query.error,

    isSuccess:
      query.isSuccess,

    pagination:
      latestPage?.pagination ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/* Get one alert                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Fetch one alert using the authentication
 * token belonging to the supplied auth scope.
 *
 * STAFF:
 *   alertsApi.getById(id, "STAFF")
 *
 * PATIENT:
 *   alertsApi.getById(id, "PATIENT")
 */
export function useAlert(
  authScope: AuthScope,
  id: string | undefined
) {
  const query = useQuery<Alert, Error>({
    /* ---------------------------------------------------------------------- */
    /* Scoped detail query key                                                */
    /* ---------------------------------------------------------------------- */

    queryKey: id
      ? alertKeys.detail(
          authScope,
          id
        )
      : alertKeys.details(
          authScope
        ),

    /* ---------------------------------------------------------------------- */
    /* Request                                                                */
    /* ---------------------------------------------------------------------- */

    queryFn: async () => {
      if (!id) {
        throw new Error(
          "Alert ID is required."
        );
      }

      return alertsApi.getById(
        id,
        authScope
      );
    },

    enabled: Boolean(id),

    staleTime: 30 * 1000,

    refetchOnWindowFocus: true,
  });

  /* ------------------------------------------------------------------------ */
  /* Return                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    alert:
      query.data ?? null,

    isLoading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    isSuccess:
      query.isSuccess,

    refetch:
      query.refetch,
  };
}