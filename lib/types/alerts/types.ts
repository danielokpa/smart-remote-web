export type AlertStatus = "ACTIVE" | "RESOLVED";

export interface Alert {
  id: string;
  patientId: string;
  readingId: string;
  parameter: string;
  value: number;
  status: AlertStatus;
  createdAt: string;

  patient?: {
    id: string;
    name: string;
  };
}