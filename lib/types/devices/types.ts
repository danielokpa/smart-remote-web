export type DeviceStatus = "ACTIVE" | "INACTIVE";

export interface Device {
  id: string;
  deviceName: string;
  status: DeviceStatus;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

export interface RegisterDevicePayload {
  deviceName: string;
}

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

export interface UpdateDevicePayload {
  deviceName?: string;
  status?: DeviceStatus;
}

/* -------------------------------------------------------------------------- */
/* List query                                                                 */
/* -------------------------------------------------------------------------- */

export interface GetDevicesParams {
  cursor?: string;
  limit?: number;
  search?: string;
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

export interface DevicesPagination {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

/* -------------------------------------------------------------------------- */
/* List response                                                              */
/* -------------------------------------------------------------------------- */

export interface DevicesListResponse {
  items: Device[];
  pagination: DevicesPagination;
}

/* -------------------------------------------------------------------------- */
/* Delete response                                                            */
/* -------------------------------------------------------------------------- */

export type DeleteDeviceResponse = boolean;