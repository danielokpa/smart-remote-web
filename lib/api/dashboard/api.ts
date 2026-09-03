import { apiRequest } from "@/lib/api/api-client";

export interface DashboardMetrics {
  totalPatients: number;
  activeAlerts: number;
  activeDevices: number;
  healthReadings: number;
}

export interface DashboardPatient {
  firstName: string;
  lastName: string;
}

export interface DashboardReading {
  id: string;
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
  recordedAt: string;
  patient: DashboardPatient;
}

export interface DashboardAlert {
  id: string;
  patientId: string;
  readingId: string;
  parameter: string;
  value: number;
  status: string;
  createdAt: string;
  patient: DashboardPatient;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;

  monitoringOverview: {
    latestReadings: DashboardReading[];
  };

  activeAlerts: DashboardAlert[];
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response =
      await apiRequest<DashboardSummary>("/dashboard/summary");

    if (!response.data) {
      throw new Error(
        "Dashboard summary data was not returned."
      );
    }

    return response.data;
  },
};
