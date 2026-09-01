import { apiRequest } from "@/lib/api/api-client";
import type { Device } from "../../types/devices/types";

export const devicesApi = {
  getAll: async (): Promise<Device[]> => {
    const response = await apiRequest<unknown>("/devices");

    return extractList<Device>(response.data);
  },

  getById: async (
    id: string
  ): Promise<Device> => {
    const response = await apiRequest<Device>(
      `/devices/${id}`
    );

    if (!response.data) {
      throw new Error("Device data was not returned.");
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