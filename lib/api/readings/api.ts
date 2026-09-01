import { apiRequest } from "@/lib/api/api-client";
import type { HealthReading } from "../../types/readings/types";

export const readingsApi = {
  getAll: async (
    patientId?: string
  ): Promise<HealthReading[]> => {
    const searchParams = new URLSearchParams();

    if (patientId) {
      searchParams.set("patientId", patientId);
    }

    const query = searchParams.toString();

    const response = await apiRequest<unknown>(
      `/readings${query ? `?${query}` : ""}`
    );

    return extractList<HealthReading>(response.data);
  },

  getById: async (
    id: string
  ): Promise<HealthReading> => {
    const response =
      await apiRequest<HealthReading>(
        `/readings/${id}`
      );

    if (!response.data) {
      throw new Error(
        "Reading data was not returned."
      );
    }

    return response.data;
  },

  getByPatient: async (
    patientId: string
  ): Promise<HealthReading[]> => {
    const response =
      await apiRequest<unknown>(
        `/readings/patient/${patientId}`
      );

    return extractList<HealthReading>(
      response.data
    );
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