export type HealthCondition =
  | "HEALTHY"
  | "HYPERTENSION"
  | "MALARIA"
  | "TYPHOID"
  | "MALARIA_AND_TYPHOID";

export type AgeGroup =
  | "CHILD"
  | "ADOLESCENT"
  | "ADULT"
  | "OLDER_ADULT";

export interface HealthValueRange {
  min: number;
  max: number;
}

export interface HealthSimulationRange {
  heartRate: HealthValueRange;
  temperature: HealthValueRange;
}

export interface HealthConditionOption {
  value: HealthCondition;
  label: string;
  description: string;
}

export interface AgeGroupDefinition {
  value: AgeGroup;
  label: string;
  minAge: number;
  maxAge: number | null;
}

export interface HealthSimulationProfile {
  condition: HealthCondition;
  ageGroup: AgeGroup;
  range: HealthSimulationRange;
}