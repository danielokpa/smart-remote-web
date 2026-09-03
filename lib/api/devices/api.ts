import { apiRequest } from "@/lib/api/api-client";

import type {
  DeleteDeviceResponse,
  Device,
  DevicesListResponse,
  GetDevicesParams,
  RegisterDevicePayload,
  UpdateDevicePayload,
} from "@/lib/types/devices/types";

export const devicesApi = {
  /* ------------------------------------------------------------------------ */
  /* Register device                                                          */
  /* POST /devices                                                            */
  /* ------------------------------------------------------------------------ */

  register: async (
    payload: RegisterDevicePayload
  ): Promise<Device> => {
    const response = await apiRequest<Device>(
      "/devices",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!response.data) {
      throw new Error(
        "Registered device data was not returned."
      );
    }

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Get all devices                                                          */
  /* GET /devices                                                             */
  /* ------------------------------------------------------------------------ */

  getAll: async (
    params: GetDevicesParams = {}
  ): Promise<DevicesListResponse> => {
    const searchParams = new URLSearchParams();

    /*
     * Search
     *
     * Only send search when it contains an actual
     * non-whitespace value.
     */
    if (
      typeof params.search === "string" &&
      params.search.trim()
    ) {
      searchParams.set(
        "search",
        params.search.trim()
      );
    }

    /*
     * Cursor
     */
    if (
      typeof params.cursor === "string" &&
      params.cursor
    ) {
      searchParams.set(
        "cursor",
        params.cursor
      );
    }

    /*
     * Limit
     */
    if (
      typeof params.limit === "number"
    ) {
      searchParams.set(
        "limit",
        String(params.limit)
      );
    }

    const query =
      searchParams.toString();

    const endpoint = query
      ? `/devices?${query}`
      : "/devices";

    const response =
      await apiRequest<DevicesListResponse>(
        endpoint
      );

    if (!response.data) {
      throw new Error(
        "Devices data was not returned."
      );
    }

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Get device by ID                                                         */
  /* GET /devices/:id                                                         */
  /* ------------------------------------------------------------------------ */

  getById: async (
    id: string
  ): Promise<Device> => {
    const response =
      await apiRequest<Device>(
        `/devices/${id}`
      );

    if (!response.data) {
      throw new Error(
        "Device data was not returned."
      );
    }

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Update device                                                            */
  /* PATCH /devices/:id                                                       */
  /* ------------------------------------------------------------------------ */

  update: async (
    id: string,
    payload: UpdateDevicePayload
  ): Promise<Device> => {
    const response =
      await apiRequest<Device>(
        `/devices/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

    if (!response.data) {
      throw new Error(
        "Updated device data was not returned."
      );
    }

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Delete device                                                            */
  /* DELETE /devices/:id                                                      */
  /*                                                                          */
  /* Backend returns:                                                         */
  /*                                                                          */
  /* data: true                                                               */
  /* ------------------------------------------------------------------------ */

  delete: async (
    id: string
  ): Promise<DeleteDeviceResponse> => {
    const response =
      await apiRequest<DeleteDeviceResponse>(
        `/devices/${id}`,
        {
          method: "DELETE",
        }
      );

    /*
     * Boolean false is a valid response.
     *
     * Therefore we MUST NOT use:
     *
     * if (!response.data)
     *
     * because false would incorrectly be treated
     * as a missing response.
     */
    if (typeof response.data !== "boolean") {
      throw new Error(
        "Device deletion response was invalid."
      );
    }

    return response.data;
  },
};