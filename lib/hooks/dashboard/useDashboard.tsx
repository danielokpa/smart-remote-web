"use client";

import {
  useQuery,
  useQueries,
} from "@tanstack/react-query";

import { patientsApi } from "@/lib/api/patients/api";
import { devicesApi } from "@/lib/api/devices/api";
import { readingsApi } from "@/lib/api/readings/api";
import { alertsApi } from "@/lib/api/alerts/api";

export const dashboardKeys = {
  all: ["dashboard"] as const,

  patients: () =>
    [...dashboardKeys.all, "patients"] as const,

  devices: () =>
    [...dashboardKeys.all, "devices"] as const,

  readings: () =>
    [...dashboardKeys.all, "readings"] as const,

  alerts: () =>
    [...dashboardKeys.all, "alerts"] as const,
};

export function useDashboard() {
  const patientsQuery = useQuery({
    queryKey: dashboardKeys.patients(),
    queryFn: patientsApi.getAll,
  });

  const devicesQuery = useQuery({
    queryKey: dashboardKeys.devices(),
    queryFn: devicesApi.getAll,
  });

  const readingsQuery = useQuery({
    queryKey: dashboardKeys.readings(),
    queryFn: () => readingsApi.getAll(),
  });

  const activeAlertsQuery = useQuery({
    queryKey: [
      ...dashboardKeys.alerts(),
      "active",
    ],
    queryFn: () =>
      alertsApi.getAll({
        status: "ACTIVE",
      }),
  });

  const isLoading =
    patientsQuery.isLoading ||
    devicesQuery.isLoading ||
    readingsQuery.isLoading ||
    activeAlertsQuery.isLoading;

  const isError =
    patientsQuery.isError ||
    devicesQuery.isError ||
    readingsQuery.isError ||
    activeAlertsQuery.isError;

  const firstError =
    patientsQuery.error ??
    devicesQuery.error ??
    readingsQuery.error ??
    activeAlertsQuery.error;

  return {
    patients: patientsQuery.data ?? [],
    devices: devicesQuery.data ?? [],
    readings: readingsQuery.data ?? [],
    activeAlerts: activeAlertsQuery.data ?? [],

    isLoading,
    isError,
    error: firstError,

    patientsQuery,
    devicesQuery,
    readingsQuery,
    activeAlertsQuery,

    refetch: async () => {
      await Promise.all([
        patientsQuery.refetch(),
        devicesQuery.refetch(),
        readingsQuery.refetch(),
        activeAlertsQuery.refetch(),
      ]);
    },
  };
}