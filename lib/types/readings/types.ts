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

export interface CreateHealthReadingPayload {
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
}

export interface HealthReadingResponse {
  status: string;
  statusCode: number;
  message: string;
  data: HealthReading;
}