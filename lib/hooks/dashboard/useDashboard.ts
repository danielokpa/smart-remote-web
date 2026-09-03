"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/lib/api/dashboard/api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () =>
    [...dashboardKeys.all, "summary"] as const,
};

export function useDashboard() {
  const dashboardQuery = useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: dashboardApi.getSummary,
  });

  const summary = dashboardQuery.data;

  return {
    metrics: summary?.metrics ?? {
      totalPatients: 0,
      activeAlerts: 0,
      activeDevices: 0,
      healthReadings: 0,
    },

    readings:
      summary?.monitoringOverview.latestReadings ?? [],

    activeAlerts:
      summary?.activeAlerts ?? [],

    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,

    dashboardQuery,

    refetch: dashboardQuery.refetch,
  };
}
