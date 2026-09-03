// export interface PatientSummary {
//   patient: {
//     id: string;
//     name: string;
//     gender: string;
//     dateOfBirth: string;
//     contact: string;
//   };

//   latestReading: {
//     heartRate: number;
//     temperature: number;
//     recordedAt: string;
//     device?: {
//       id: string;
//       deviceName: string;
//       status: string;
//     };
//   } | null;

//   activeAlerts: Array<{
//     id?: string;
//     parameter: string;
//     value: number;
//     createdAt: string;
//     status?: string;
//   }>;

//   threshold: {
//     minHeartRate: number;
//     maxHeartRate: number;
//     minTemperature: number;
//     maxTemperature: number;
//   };
// }

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPatientPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contact: string;
}

export interface UpdatePatientPayload {
  firstName?: string;
  lastName?: string;
  contact?: string;
  gender?: string;
}

export interface GetPatientsParams {
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface PatientsPagination {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

export interface PatientsListResponse {
  items: Patient[];
  pagination: PatientsPagination;
}

export interface PatientReading {
  id: string;
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
  recordedAt: string;
}

export interface PatientAlert {
  id: string;
  patientId: string;
  readingId: string;
  parameter: string;
  value: number;
  status: string;
  createdAt: string;
}

export interface PatientSummary extends Patient {
  readings: PatientReading[];
  alerts: PatientAlert[];
  latestReading: PatientReading | null;
  activeAlerts: PatientAlert[];
}
