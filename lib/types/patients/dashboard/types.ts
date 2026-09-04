/**
 * Patient Dashboard Types
 *
 * These interfaces represent the response returned by:
 *
 * GET /patients/summary
 *
 * The patient ID is resolved by the backend from the
 * authenticated patient's JWT.
 */

/* -------------------------------------------------------------------------- */
/* Patient profile                                                            */
/* -------------------------------------------------------------------------- */

export interface PatientDashboardProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Health reading                                                             */
/* -------------------------------------------------------------------------- */

export interface PatientDashboardReading {
  id: string;
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
  recordedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Health alert                                                               */
/* -------------------------------------------------------------------------- */

export type PatientDashboardAlertStatus =
  | "ACTIVE"
  | "RESOLVED"
  | "DISMISSED"
  | string;

export interface PatientDashboardAlert {
  id: string;
  patientId: string;
  readingId: string;
  parameter: string;
  value: number;
  status: PatientDashboardAlertStatus;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Patient dashboard summary                                                  */
/* -------------------------------------------------------------------------- */

export interface PatientDashboardSummary
  extends PatientDashboardProfile {
  readings: PatientDashboardReading[];

  alerts: PatientDashboardAlert[];

  latestReading: PatientDashboardReading | null;

  activeAlerts: PatientDashboardAlert[];
}

/* -------------------------------------------------------------------------- */
/* API response                                                               */
/* -------------------------------------------------------------------------- */

/**
 * This represents the complete `data` object returned by
 * GET /patients/summary.
 *
 * Your existing apiRequest<T>() already wraps this in ApiResponse<T>,
 * so the API function itself should return:
 *
 * ApiResponse<PatientDashboardSummary>
 */