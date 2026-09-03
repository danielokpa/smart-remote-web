"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients/api";

import type {
  GetPatientsParams,
  RegisterPatientPayload,
  UpdatePatientPayload,
} from "@/lib/types/patients/types";

export const patientKeys = {
  all: ["patients"] as const,

  lists: () =>
    [...patientKeys.all, "list"] as const,

  list: (params: GetPatientsParams) =>
    [...patientKeys.lists(), params] as const,

  details: () =>
    [...patientKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...patientKeys.details(), id] as const,

  summaries: () =>
    [...patientKeys.all, "summary"] as const,

  summary: (id: string) =>
    [...patientKeys.summaries(), id] as const,
};

export function usePatients(
  params: GetPatientsParams = {}
) {
  const queryClient = useQueryClient();

  /*
   * Patients list
   *
   * The query key contains the complete set of list parameters
   * so React Query keeps separate cache entries for:
   *
   * - different searches
   * - different cursors
   * - different limits
   *
   * keepPreviousData prevents the table from unnecessarily
   * becoming empty while a new cursor/search result is loading.
   */
  const patientsQuery = useQuery({
    queryKey: patientKeys.list(params),

    queryFn: () =>
      patientsApi.getAll(params),

    placeholderData: keepPreviousData,
  });

  /*
   * Register patient
   */
  const registerMutation = useMutation({
    mutationFn: (
      payload: RegisterPatientPayload
    ) => patientsApi.register(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientKeys.lists(),
      });
    },
  });

  /*
   * Update patient
   */
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePatientPayload;
    }) =>
      patientsApi.update(id, payload),

    onSuccess: (updatedPatient) => {
      /*
       * Immediately update the cached patient detail.
       */
      queryClient.setQueryData(
        patientKeys.detail(updatedPatient.id),
        updatedPatient
      );

      /*
       * Refresh every cached patient list because
       * the updated patient's name/contact/etc. may be
       * visible in one or more list queries.
       */
      queryClient.invalidateQueries({
        queryKey: patientKeys.lists(),
      });

      /*
       * Refresh the patient's summary because the
       * summary also contains the patient's basic details.
       */
      queryClient.invalidateQueries({
        queryKey: patientKeys.summary(
          updatedPatient.id
        ),
      });
    },
  });

  return {
    /*
     * List data
     */
    patients:
      patientsQuery.data?.items ?? [],

    pagination:
      patientsQuery.data?.pagination ?? {
        limit: params.limit ?? 20,
        hasNextPage: false,
        nextCursor: null,
      },

    /*
     * Query state
     */
    isLoading:
      patientsQuery.isLoading,

    isFetching:
      patientsQuery.isFetching,

    isError:
      patientsQuery.isError,

    error:
      patientsQuery.error,

    /*
     * Raw query instance.
     *
     * This gives the page access to anything additional
     * React Query exposes without having to modify this hook.
     */
    patientsQuery,

    /*
     * Registration
     */
    registerPatient:
      registerMutation.mutateAsync,

    isRegistering:
      registerMutation.isPending,

    registerError:
      registerMutation.error,

    /*
     * Update
     */
    updatePatient:
      updateMutation.mutateAsync,

    isUpdating:
      updateMutation.isPending,

    updateError:
      updateMutation.error,

    /*
     * Manual refresh
     */
    refetch:
      patientsQuery.refetch,
  };
}