import { apiRequest } from "@/lib/api/api-client";
import type {
  HealthReading,
  CreateHealthReadingPayload,
} from "../../types/readings/types";
import type {
  GetReadingsParams,
  ReadingsListResponse,
} from "../../types/readings/readings";

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

   /* Submit a health reading for the authenticated patient.
   *
   * The patientId is included in the request payload because
   * that is what the backend endpoint currently expects.
   *
   * Authorization is automatically attached by apiRequest().
   */
  create: async (
    payload: CreateHealthReadingPayload
  ): Promise<HealthReading> => {
    const response = await apiRequest<HealthReading>(
      "/readings",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!response.data) {
      throw new Error(
        "Health reading data was not returned."
      );
    }

    return response.data;
  },
  /**
   * Create a new health reading.
   */
  // create: async (
  //   payload: CreateHealthReadingPayload
  // ): Promise<HealthReading> => {
  //   const response = await apiRequest<HealthReading>(
  //     "/readings",
  //     {
  //       method: "POST",
  //       body: JSON.stringify(payload),
  //     }
  //   );

  //   if (!response.data) {
  //     throw new Error(
  //       "Health reading data was not returned."
  //     );
  //   }

  //   return response.data;
  // },

  /**
   * Retrieve health readings.
   *
   * Supports:
   * - patient filtering
   * - cursor pagination
   * - page size
   * - search
   */
  // list: async (
  //   params?: GetReadingsParams
  // ): Promise<ReadingsListResponse> => {
  //   const query = buildReadingsQuery(params);

  //   const response =
  //     await apiRequest<ReadingsListResponse>(
  //       `/readings${query}`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //   if (!response.data) {
  //     throw new Error(
  //       "Health readings data was not returned."
  //     );
  //   }

  //   return response.data;
  // },
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


/////////////////////

function buildReadingsQuery(
  params?: GetReadingsParams
): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.patientId) {
    searchParams.set("patientId", params.patientId);
  }

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}
