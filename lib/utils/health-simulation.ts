import type { HealthSimulationRange } from "@/lib/types/health-simulation/types";

/**
 * Generates a random integer between min and max, inclusive.
 */
function randomInteger(min: number, max: number): number {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error(
      "Random number boundaries must be finite numbers."
    );
  }

  if (min > max) {
    throw new Error(
      "Random number minimum cannot be greater than maximum."
    );
  }

  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

/**
 * Generates a random decimal between min and max.
 *
 * The returned value is rounded to one decimal place.
 */
function randomDecimal(
  min: number,
  max: number
): number {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error(
      "Random decimal boundaries must be finite numbers."
    );
  }

  if (min > max) {
    throw new Error(
      "Random decimal minimum cannot be greater than maximum."
    );
  }

  const value =
    Math.random() * (max - min) + min;

  return Math.round(value * 10) / 10;
}

/**
 * Generates a simulated health reading using the supplied
 * condition/age-specific ranges.
 *
 * Every invocation generates a new value, so consecutive
 * submissions will not always contain identical readings.
 *
 * NOTE:
 * These values are intended strictly for application
 * simulation/testing and are not clinical measurements.
 */
export function generateHealthReading(
  range: HealthSimulationRange
): {
  heartRate: number;
  temperature: number;
} {
  if (!range) {
    throw new Error(
      "A valid health simulation range is required."
    );
  }

  const { heartRate, temperature } = range;

  if (
    heartRate.min < 0 ||
    heartRate.max < 0 ||
    heartRate.min > heartRate.max
  ) {
    throw new Error(
      "Invalid heart-rate simulation range."
    );
  }

  if (
    temperature.min > temperature.max
  ) {
    throw new Error(
      "Invalid temperature simulation range."
    );
  }

  return {
    heartRate: randomInteger(
      heartRate.min,
      heartRate.max
    ),
    temperature: randomDecimal(
      temperature.min,
      temperature.max
    ),
  };
}