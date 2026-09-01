import { apiRequest } from "@/lib/api/api-client";
import type {
  Patient,
  PatientSummary,
} from "../../types/patients/types";

export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiRequest<unknown>("/patients");

    return extractList<Patient>(response.data);
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await apiRequest<Patient>(
      `/patients/${id}`
    );

    if (!response.data) {
      throw new Error("Patient data was not returned.");
    }

    return response.data;
  },

  getSummary: async (
    id: string
  ): Promise<PatientSummary> => {
    const response = await apiRequest<PatientSummary>(
      `/patients/${id}/summary`
    );

    if (!response.data) {
      throw new Error(
        "Patient summary was not returned."
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