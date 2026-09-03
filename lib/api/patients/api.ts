// import { apiRequest } from "@/lib/api/api-client";
// import type {
//   Patient,
//   PatientSummary,
// } from "../../types/patients/types";

// export const patientsApi = {
//   getAll: async (): Promise<Patient[]> => {
//     const response = await apiRequest<unknown>("/patients");

//     return extractList<Patient>(response.data);
//   },

//   getById: async (id: string): Promise<Patient> => {
//     const response = await apiRequest<Patient>(
//       `/patients/${id}`
//     );

//     if (!response.data) {
//       throw new Error("Patient data was not returned.");
//     }

//     return response.data;
//   },

//   getSummary: async (
//     id: string
//   ): Promise<PatientSummary> => {
//     const response = await apiRequest<PatientSummary>(
//       `/patients/${id}/summary`
//     );

//     if (!response.data) {
//       throw new Error(
//         "Patient summary was not returned."
//       );
//     }

//     return response.data;
//   },
// };

// function extractList<T>(data: unknown): T[] {
//   if (Array.isArray(data)) {
//     return data as T[];
//   }

//   if (
//     data &&
//     typeof data === "object" &&
//     "data" in data &&
//     Array.isArray(
//       (data as { data: unknown }).data
//     )
//   ) {
//     return (data as { data: T[] }).data;
//   }

//   return [];
// }

import { apiRequest } from "@/lib/api/api-client";

import type {
  GetPatientsParams,
  Patient,
  PatientSummary,
  PatientsListResponse,
  RegisterPatientPayload,
  UpdatePatientPayload,
} from "@/lib/types/patients/types";

export const patientsApi = {
  /**
   * Register a new patient.
   */
  register: async (
    payload: RegisterPatientPayload
  ): Promise<Patient> => {
    const response = await apiRequest<Patient>(
      "/patients",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!response.data) {
      throw new Error(
        "Registered patient data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Get patients with cursor pagination and optional search.
   */
  getAll: async (
    params: GetPatientsParams = {}
  ): Promise<PatientsListResponse> => {
    const searchParams = new URLSearchParams();

    if (params.search?.trim()) {
      searchParams.set(
        "search",
        params.search.trim()
      );
    }

    if (params.cursor) {
      searchParams.set(
        "cursor",
        params.cursor
      );
    }

    if (params.limit) {
      searchParams.set(
        "limit",
        String(params.limit)
      );
    }

    const query = searchParams.toString();

    const response =
      await apiRequest<PatientsListResponse>(
        `/patients${query ? `?${query}` : ""}`
      );

    if (!response.data) {
      throw new Error(
        "Patients data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Get a single patient by ID.
   */
  getById: async (
    id: string
  ): Promise<Patient> => {
    const response =
      await apiRequest<Patient>(
        `/patients/${id}`
      );

    if (!response.data) {
      throw new Error(
        "Patient data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Update an existing patient.
   */
  update: async (
    id: string,
    payload: UpdatePatientPayload
  ): Promise<Patient> => {
    const response =
      await apiRequest<Patient>(
        `/patients/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

    if (!response.data) {
      throw new Error(
        "Updated patient data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Get a patient's complete monitoring summary.
   */
  getSummary: async (
    id: string
  ): Promise<PatientSummary> => {
    const response =
      await apiRequest<PatientSummary>(
        `/patients/${id}/summary`
      );

    if (!response.data) {
      throw new Error(
        "Patient summary data was not returned."
      );
    }

    return response.data;
  },
};
