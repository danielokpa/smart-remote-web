export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  contact: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientSummary {
  patient: {
    id: string;
    name: string;
    gender: string;
    dateOfBirth: string;
    contact: string;
  };

  latestReading: {
    heartRate: number;
    temperature: number;
    recordedAt: string;
    device?: {
      id: string;
      deviceName: string;
      status: string;
    };
  } | null;

  activeAlerts: Array<{
    id?: string;
    parameter: string;
    value: number;
    createdAt: string;
    status?: string;
  }>;

  threshold: {
    minHeartRate: number;
    maxHeartRate: number;
    minTemperature: number;
    maxTemperature: number;
  };
}