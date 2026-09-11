import {
  scopedApiRequest,
} from "@/lib/api/api-client";

import type {
  AuthScope,
} from "@/lib/types/auth/types";

import type {
  Alert,
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
    searchParams.set(
      "status",
      params.status
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

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

function validateAlertId(
  id: string
): void {
  if (!id || !id.trim()) {
    throw new Error(
      "An alert ID is required."
    );
  }
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const alertsApi = {
  /**
   * Get alerts for the authenticated scope.
   *
   * STAFF:
   *   Uses the staff token.
   *
   * PATIENT:
   *   Uses the patient token.
   */
  list: async (
    params: GetAlertsParams | undefined,
    authScope: AuthScope
  ): Promise<AlertsListResponse> => {
    const query =
      buildAlertsQuery(params);

    const response =
      await scopedApiRequest<AlertsListResponse>(
        authScope,
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
   * Get one alert using the token belonging
   * to the supplied authentication scope.
   */
  getById: async (
    id: string,
    authScope: AuthScope
  ): Promise<Alert> => {
    validateAlertId(id);

    const response =
      await scopedApiRequest<Alert>(
        authScope,
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