export interface HealthReading {
  id: string;
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
  recordedAt: string;

  patient?: {
    id: string;
    name: string;
  };

  device?: {
    id: string;
    deviceName: string;
  };
}