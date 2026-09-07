import type { DeviceStatus } from '@/lib/types/devices/types';
import type { Patient as ReadingPatient } from '@/lib/types/patients/types';

export interface CreateHealthReadingPayload {
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
}

export interface HealthReading {
  id: string;
  patientId: string;
  deviceId: string;
  heartRate: number;
  temperature: number;
  recordedAt: string;
}

/**
 * Patient information returned with a reading.
 */
// export interface ReadingPatient {
//   id: string;
//   firstName: string;
//   lastName: string;
//   dateOfBirth: string;
//   gender: string;
//   contact: string;
//   createdAt: string;
//   updatedAt: string;
// }

/**
 * Device information returned with a reading.
 */
export interface ReadingDevice {
  id: string;
  deviceName: string;
  status: DeviceStatus;
  createdAt: string;
}

/**
 * Alert attached to a health reading.
 */
export interface ReadingAlert {
  id: string;
  patientId: string;
  readingId: string;
  parameter: string;
  value: number;
  status: string;
  createdAt: string;
}

/**
 * A health reading as returned by GET /readings.
 */
export interface ReadingListItem extends HealthReading {
  patient: ReadingPatient;
  device: ReadingDevice;
  alerts: ReadingAlert[];
}

/**
 * Query parameters supported by GET /readings.
 */
export interface GetReadingsParams {
  patientId?: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

/**
 * Cursor pagination metadata returned by the API.
 */
export interface ReadingsPagination {
  limit: number;
  hasNextPage: boolean;
  nextCursor: string | null;
}

/**
 * GET /readings response data.
 */
export interface ReadingsListResponse {
  items: ReadingListItem[];
  pagination: ReadingsPagination;
}


/* -------------------------------------------------------------------------- */
/* Reading detail                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Full health reading returned by GET /readings/:id.
 *
 * This is intentionally separate from ReadingListItem so the detail
 * endpoint can evolve independently from the list endpoint.
 */
export interface ReadingDetail extends HealthReading {
  patient: ReadingPatient;
  device: ReadingDevice;
  alerts: ReadingAlert[];
}