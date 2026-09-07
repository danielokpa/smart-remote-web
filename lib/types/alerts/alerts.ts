import type { Patient as AlertPatient } from '@/lib/types/patients/types';
export type AlertStatus =
  | "ACTIVE"
  | "RESOLVED"
  | "DISMISSED";

export type AlertParameter =
  | "heart_rate"
  | "temperature"
  | string;

/* -------------------------------------------------------------------------- */
/* Patient                                                                    */
/* -------------------------------------------------------------------------- */

// export interface AlertPatient {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   dateOfBirth: string;
//   gender: string;
//   contact: string;
//   createdAt: string;
//   updatedAt: string;
// }

/* -------------------------------------------------------------------------- */
/* Reading                                                                    */
/* -------------------------------------------------------------------------- */

export interface AlertReading {
  id: string;
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
  recordedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Alert                                                                       */
/* -------------------------------------------------------------------------- */

export interface Alert {
  id: string;
  patientId: string;
  readingId: string;
  parameter: AlertParameter;
  value: number;
  status: AlertStatus;
  createdAt: string;

  patient: AlertPatient;

  reading: AlertReading;
}

/* -------------------------------------------------------------------------- */
/* Query                                                                       */
/* -------------------------------------------------------------------------- */

export interface GetAlertsParams {
  patientId?: string;
  status?: AlertStatus;
  cursor?: string;
  limit?: number;
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                  */
/* -------------------------------------------------------------------------- */

export interface AlertsPagination {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

/* -------------------------------------------------------------------------- */
/* List response                                                               */
/* -------------------------------------------------------------------------- */

export interface AlertsListResponse {
  items: Alert[];
  pagination: AlertsPagination;
}

export const ALERT_STATUS_OPTIONS: Array<{
  value: AlertStatus;
  label: string;
}> = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "RESOLVED",
    label: "Resolved",
  },
  {
    value: "DISMISSED",
    label: "Dismissed",
  },
];