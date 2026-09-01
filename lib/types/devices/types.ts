export type DeviceStatus = "ACTIVE" | "INACTIVE";

export interface Device {
  id: string;
  deviceName: string;
  status: DeviceStatus;
  createdAt: string;
}