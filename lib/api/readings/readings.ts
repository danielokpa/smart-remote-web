import { apiRequest } from "@/lib/api/api-client";

import type {
  HealthReading,
  CreateHealthReadingPayload,
} from "../../types/readings/types";
import type {
  GetReadingsParams,
  ReadingsListResponse,
  ReadingDetail,
} from "../../types/readings/readings";

/* -------------------------------------------------------------------------- */
/* Query builder                                                              */
/* -------------------------------------------------------------------------- */

function buildReadingsQuery(
  params?: GetReadingsParams
): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.patientId) {
    searchParams.set(
      "patientId",
      params.patientId
    );
  }

  if (params.cursor) {
    searchParams.set(
      "cursor",
      params.cursor
    );
  }

  if (params.limit !== undefined) {
    searchParams.set(
      "limit",
      String(params.limit)
    );
  }

  if (params.search?.trim()) {
    searchParams.set(
      "search",
      params.search.trim()
    );
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

/* -------------------------------------------------------------------------- */
/* ID validation                                                              */
/* -------------------------------------------------------------------------- */

function validateReadingId(id: string): void {
  if (!id || !id.trim()) {
    throw new Error(
      "A reading ID is required."
    );
  }
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const readingsApi = {
  /**
   * Create a new health reading.
   */
  create: async (
    payload: CreateHealthReadingPayload
  ): Promise<HealthReading> => {
    const response =
      await apiRequest<HealthReading>(
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
   * Retrieve health readings.
   *
   * Supports:
   * - patient filtering
   * - cursor pagination
   * - page size
   * - search
   */
  list: async (
    params?: GetReadingsParams
  ): Promise<ReadingsListResponse> => {
    const query =
      buildReadingsQuery(params);

    const response =
      await apiRequest<ReadingsListResponse>(
        `/readings${query}`,
        {
          method: "GET",
        }
      );

    if (!response.data) {
      throw new Error(
        "Health readings data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Retrieve a single health reading by ID.
   *
   * GET /readings/:id
   */
  getById: async (
    id: string
  ): Promise<ReadingDetail> => {
    validateReadingId(id);

    const response =
      await apiRequest<ReadingDetail>(
        `/readings/${encodeURIComponent(id)}`,
        {
          method: "GET",
        }
      );

    if (!response.data) {
      throw new Error(
        "Reading detail data was not returned."
      );
    }

    return response.data;
  },
};