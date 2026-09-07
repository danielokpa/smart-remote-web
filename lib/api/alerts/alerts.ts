import { apiRequest } from "@/lib/api/api-client";

import type {
  Alert,
  AlertStatus,
  AlertsListResponse,
  GetAlertsParams,
} from "@/lib/types/alerts/alerts";

/* -------------------------------------------------------------------------- */
/* Query builder                                                              */
/* -------------------------------------------------------------------------- */

function buildAlertsQuery(
  params?: GetAlertsParams
): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.patientId?.trim()) {
    searchParams.set(
      "patientId",
      params.patientId.trim()
    );
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  if (params.limit !== undefined) {
    searchParams.set(
      "limit",
      String(params.limit)
    );
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

function validateAlertId(id: string): void {
  if (!id || !id.trim()) {
    throw new Error("An alert ID is required.");
  }
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const alertsApi = {
  /**
   * Get all alerts.
   *
   * Supports:
   * - patient filtering
   * - status filtering
   * - cursor pagination
   * - configurable page size
   */
  list: async (
    params?: GetAlertsParams
  ): Promise<AlertsListResponse> => {
    const query = buildAlertsQuery(params);

    const response =
      await apiRequest<AlertsListResponse>(
        `/alerts${query}`,
        {
          method: "GET",
        }
      );

    if (!response.data) {
      throw new Error(
        "Alerts data was not returned."
      );
    }

    return response.data;
  },

  /**
   * Get a single alert.
   *
   * This is intentionally included here only if/when
   * GET /alerts/:id is exposed by the backend.
   *
   * Do not use this method until that endpoint exists.
   */
  getById: async (id: string): Promise<Alert> => {
    validateAlertId(id);

    const response = await apiRequest<Alert>(
      `/alerts/${encodeURIComponent(id)}`,
      {
        method: "GET",
      }
    );

    if (!response.data) {
      throw new Error(
        "Alert detail data was not returned."
      );
    }

    return response.data;
  },
};