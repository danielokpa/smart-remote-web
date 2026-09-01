import { apiRequest } from "@/lib/api/api-client";
import type {
  Alert,
  AlertStatus,
} from "../../types/alerts/types";

interface GetAlertsParams {
  patientId?: string;
  status?: AlertStatus;
}

export const alertsApi = {
  getAll: async (
    params: GetAlertsParams = {}
  ): Promise<Alert[]> => {
    const searchParams = new URLSearchParams();

    if (params.patientId) {
      searchParams.set(
        "patientId",
        params.patientId
      );
    }

    if (params.status) {
      searchParams.set(
        "status",
        params.status
      );
    }

    const query = searchParams.toString();

    const response = await apiRequest<unknown>(
      `/alerts${query ? `?${query}` : ""}`
    );

    return extractList<Alert>(response.data);
  },

  getById: async (
    id: string
  ): Promise<Alert> => {
    const response =
      await apiRequest<Alert>(
        `/alerts/${id}`
      );

    if (!response.data) {
      throw new Error(
        "Alert data was not returned."
      );
    }

    return response.data;
  },

  resolve: async (
    id: string
  ): Promise<Alert> => {
    const response =
      await apiRequest<Alert>(
        `/alerts/${id}/resolve`,
        {
          method: "PATCH",
        }
      );

    if (!response.data) {
      throw new Error(
        "Resolved alert was not returned."
      );
    }

    return response.data;
  },
};

function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray(
      (data as { data: unknown }).data
    )
  ) {
    return (data as { data: T[] }).data;
  }

  return [];
}