"use client";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients/api";

import {
  patientKeys,
} from "@/lib/hooks/patients/usePatients";

import type {
  UpdatePatientPayload,
} from "@/lib/types/patients/types";

export function usePatient(
  patientId?: string
) {
  const queryClient = useQueryClient();

  /*
   * --------------------------------------------------------------------------
   * Get patient
   *
   * GET /patients/:id
   *
   * This retrieves the patient's primary record:
   * - id
   * - firstName
   * - lastName
   * - dateOfBirth
   * - gender
   * - contact
   * - createdAt
   * - updatedAt
   * --------------------------------------------------------------------------
   */

  const patientQuery = useQuery({
    queryKey: patientKeys.detail(
      patientId ?? ""
    ),

    queryFn: () => {
      if (!patientId) {
        throw new Error(
          "Patient ID is required."
        );
      }

      return patientsApi.getById(
        patientId
      );
    },

    enabled: Boolean(patientId),
  });

  /*
   * --------------------------------------------------------------------------
   * Get patient summary
   *
   * GET /patients/:id/summary
   *
   * This retrieves:
   * - patient information
   * - readings
   * - alerts
   * - latestReading
   * - activeAlerts
   * --------------------------------------------------------------------------
   */

  const summaryQuery = useQuery({
    queryKey: patientKeys.summary(
      patientId ?? ""
    ),

    queryFn: () => {
      if (!patientId) {
        throw new Error(
          "Patient ID is required."
        );
      }

      return patientsApi.getSummary(
        patientId
      );
    },

    enabled: Boolean(patientId),
  });

  /*
   * --------------------------------------------------------------------------
   * Update patient
   *
   * This is kept here because this hook represents the complete
   * single-patient/detail workflow.
   *
   * PATCH /patients/:id
   *
   * Note:
   * UpdatePatientPayload does NOT contain dateOfBirth because
   * the backend UpdatePatientDto does not support it.
   * --------------------------------------------------------------------------
   */

  const updatePatient = async (
    payload: UpdatePatientPayload
  ) => {
    if (!patientId) {
      throw new Error(
        "Patient ID is required to update a patient."
      );
    }

    const updatedPatient =
      await patientsApi.update(
        patientId,
        payload
      );

    /*
     * Immediately update the individual patient cache.
     */
    queryClient.setQueryData(
      patientKeys.detail(patientId),
      updatedPatient
    );

    /*
     * Refresh patient lists because the updated
     * patient's name/contact/gender may appear there.
     */
    await queryClient.invalidateQueries({
      queryKey: patientKeys.lists(),
    });

    /*
     * Refresh the summary because it also contains
     * the patient's basic information.
     */
    await queryClient.invalidateQueries({
      queryKey: patientKeys.summary(
        patientId
      ),
    });

    return updatedPatient;
  };

  /*
   * --------------------------------------------------------------------------
   * Combined states
   * --------------------------------------------------------------------------
   */

  const isLoading =
    patientQuery.isLoading ||
    summaryQuery.isLoading;

  const isFetching =
    patientQuery.isFetching ||
    summaryQuery.isFetching;

  const isError =
    patientQuery.isError ||
    summaryQuery.isError;

  /*
   * Prefer the patient error first, otherwise use
   * the summary error.
   */
  const error =
    patientQuery.error ??
    summaryQuery.error ??
    null;

  /*
   * --------------------------------------------------------------------------
   * Manual refresh
   *
   * Refresh both endpoints together.
   * --------------------------------------------------------------------------
   */

  const refetch = async () => {
    await Promise.all([
      patientQuery.refetch(),
      summaryQuery.refetch(),
    ]);
  };

  return {
    /*
     * Primary patient record
     */
    patient:
      patientQuery.data ?? null,

    /*
     * Patient monitoring summary
     */
    summary:
      summaryQuery.data ?? null,

    /*
     * Query states
     */
    isLoading,
    isFetching,
    isError,
    error,

    /*
     * Individual query states
     *
     * Useful when the UI needs to know whether
     * the patient record or monitoring summary
     * is still loading.
     */
    isPatientLoading:
      patientQuery.isLoading,

    isSummaryLoading:
      summaryQuery.isLoading,

    isPatientFetching:
      patientQuery.isFetching,

    isSummaryFetching:
      summaryQuery.isFetching,

    /*
     * Raw React Query instances.
     *
     * Useful if the detail page later needs
     * more advanced React Query functionality.
     */
    patientQuery,
    summaryQuery,

    /*
     * Update
     */
    updatePatient,

    /*
     * Manual refresh
     */
    refetch,
  };
}