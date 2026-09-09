import {
  scopedApiRequest,
  staffApiRequest,
} from "@/lib/api/api-client";

import type { AuthScope } from "@/lib/types/auth/types";

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
  /* STAFF ONLY                                                               */
  /* ------------------------------------------------------------------------ */

  register: async (
    payload: RegisterDevicePayload
  ): Promise<Device> => {
    const response =
      await staffApiRequest<Device>(
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
  /* STAFF + PATIENT                                                          */
  /* ------------------------------------------------------------------------ */

  getAll: async (
    params: GetDevicesParams = {},
    authScope: AuthScope
  ): Promise<DevicesListResponse> => {
    const searchParams =
      new URLSearchParams();

    if (
      typeof params.search === "string" &&
      params.search.trim()
    ) {
      searchParams.set(
        "search",
        params.search.trim()
      );
    }

    if (
      typeof params.cursor === "string" &&
      params.cursor
    ) {
      searchParams.set(
        "cursor",
        params.cursor
      );
    }

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
      await scopedApiRequest<DevicesListResponse>(
        authScope,
        endpoint,
        {
          method: "GET",
        }
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
  /* STAFF + PATIENT                                                          */
  /* ------------------------------------------------------------------------ */

  getById: async (
    id: string,
    authScope: AuthScope
  ): Promise<Device> => {
    const response =
      await scopedApiRequest<Device>(
        authScope,
        `/devices/${id}`,
        {
          method: "GET",
        }
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
  /* STAFF ONLY                                                               */
  /* ------------------------------------------------------------------------ */

  update: async (
    id: string,
    payload: UpdateDevicePayload
  ): Promise<Device> => {
    const response =
      await staffApiRequest<Device>(
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
  /* STAFF ONLY                                                               */
  /* ------------------------------------------------------------------------ */

  delete: async (
    id: string
  ): Promise<DeleteDeviceResponse> => {
    const response =
      await staffApiRequest<DeleteDeviceResponse>(
        `/devices/${id}`,
        {
          method: "DELETE",
        }
      );

    if (
      typeof response.data !== "boolean"
    ) {
      throw new Error(
        "Device deletion response was invalid."
      );
    }

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Get available devices                                                    */
  /* GET /devices                                                             */
  /* STAFF + PATIENT                                                          */
  /* ------------------------------------------------------------------------ */

  getAvailable: async (
    authScope: AuthScope
  ): Promise<DevicesListResponse> => {
    const response =
      await scopedApiRequest<DevicesListResponse>(
        authScope,
        "/devices",
        {
          method: "GET",
        }
      );

    if (!response.data) {
      throw new Error(
        "Devices data was not returned."
      );
    }

    return response.data;
  },
};