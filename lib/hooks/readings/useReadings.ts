"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { readingsApi } from "@/lib/api/readings/api";

import type {
  CreateHealthReadingPayload,
  HealthReading,
} from "@/lib/types/readings/types";

import { patientDashboardKeys } from "@/lib/hooks/patients/usePatients";

export const readingKeys = {
  all: ["readings"] as const,

  lists: () =>
    [...readingKeys.all, "list"] as const,

  list: (patientId: string) =>
    [...readingKeys.lists(), patientId] as const,

  detail: (id: string) =>
    [...readingKeys.all, "detail", id] as const,
};

export function useCreateHealthReading() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    HealthReading,
    Error,
    CreateHealthReadingPayload
  >({
    mutationKey: ["readings", "create"],

    mutationFn: (payload) =>
      readingsApi.create(payload),

    onSuccess: () => {
      /*
       * The patient's dashboard summary contains:
       *
       * - readings
       * - latestReading
       * - alerts
       * - activeAlerts
       *
       * Therefore a newly submitted reading can change
       * several sections of the patient dashboard.
       */
      queryClient.invalidateQueries({
        queryKey: patientDashboardKeys.summary(),
      });

      /*
       * Also invalidate patient reading caches if
       * individual reading pages are introduced later.
       */
      queryClient.invalidateQueries({
        queryKey: readingKeys.lists(),
      });
    },
  });

  return {
    createReading:
      mutation.mutateAsync,

    isCreating:
      mutation.isPending,

    isError:
      mutation.isError,

    error:
      mutation.error,

    isSuccess:
      mutation.isSuccess,

    data:
      mutation.data,

    reset:
      mutation.reset,
  };
}