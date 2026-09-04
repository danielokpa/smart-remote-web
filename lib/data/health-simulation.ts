import type {
  AgeGroup,
  AgeGroupDefinition,
  HealthCondition,
  HealthConditionOption,
  HealthSimulationRange,
} from "@/lib/types/health-simulation/types";

/**
 * Age groups used by the health-reading simulator.
 *
 * These groups are intentionally broad so that the UI
 * remains simple for patients.
 */
export const HEALTH_AGE_GROUPS: AgeGroupDefinition[] = [
  {
    value: "CHILD",
    label: "Child",
    minAge: 0,
    maxAge: 12,
  },
  {
    value: "ADOLESCENT",
    label: "Adolescent",
    minAge: 13,
    maxAge: 17,
  },
  {
    value: "ADULT",
    label: "Adult",
    minAge: 18,
    maxAge: 64,
  },
  {
    value: "OLDER_ADULT",
    label: "Older adult",
    minAge: 65,
    maxAge: null,
  },
];

/**
 * Conditions available in the simulator.
 */
export const HEALTH_CONDITION_OPTIONS: HealthConditionOption[] = [
  {
    value: "HEALTHY",
    label: "Generally healthy",
    description:
      "Simulate a general health reading without a selected condition.",
  },
  {
    value: "HYPERTENSION",
    label: "Hypertension",
    description:
      "Simulate readings for a patient selected as hypertensive.",
  },
  {
    value: "MALARIA",
    label: "Malaria",
    description:
      "Simulate readings associated with a malaria scenario.",
  },
  {
    value: "TYPHOID",
    label: "Typhoid",
    description:
      "Simulate readings associated with a typhoid scenario.",
  },
  {
    value: "MALARIA_AND_TYPHOID",
    label: "Malaria & Typhoid",
    description:
      "Simulate readings for a combined malaria and typhoid scenario.",
  },
];

/**
 * Simulation ranges.
 *
 * IMPORTANT:
 * These values are for application simulation/testing only.
 * They are not clinical diagnostic thresholds.
 *
 * Each condition contains age-specific ranges.
 */
export const HEALTH_SIMULATION_RANGES: Record<
  HealthCondition,
  Record<AgeGroup, HealthSimulationRange>
> = {
  HEALTHY: {
    CHILD: {
      heartRate: {
        min: 75,
        max: 110,
      },
      temperature: {
        min: 36.3,
        max: 37.2,
      },
    },

    ADOLESCENT: {
      heartRate: {
        min: 65,
        max: 100,
      },
      temperature: {
        min: 36.3,
        max: 37.2,
      },
    },

    ADULT: {
      heartRate: {
        min: 60,
        max: 95,
      },
      temperature: {
        min: 36.3,
        max: 37.2,
      },
    },

    OLDER_ADULT: {
      heartRate: {
        min: 60,
        max: 95,
      },
      temperature: {
        min: 36.2,
        max: 37.2,
      },
    },
  },

  HYPERTENSION: {
    CHILD: {
      heartRate: {
        min: 75,
        max: 115,
      },
      temperature: {
        min: 36.3,
        max: 37.3,
      },
    },

    ADOLESCENT: {
      heartRate: {
        min: 70,
        max: 105,
      },
      temperature: {
        min: 36.3,
        max: 37.3,
      },
    },

    ADULT: {
      heartRate: {
        min: 70,
        max: 105,
      },
      temperature: {
        min: 36.3,
        max: 37.3,
      },
    },

    OLDER_ADULT: {
      heartRate: {
        min: 65,
        max: 105,
      },
      temperature: {
        min: 36.2,
        max: 37.3,
      },
    },
  },

  MALARIA: {
    CHILD: {
      heartRate: {
        min: 85,
        max: 125,
      },
      temperature: {
        min: 37.5,
        max: 39.5,
      },
    },

    ADOLESCENT: {
      heartRate: {
        min: 80,
        max: 120,
      },
      temperature: {
        min: 37.5,
        max: 39.5,
      },
    },

    ADULT: {
      heartRate: {
        min: 80,
        max: 120,
      },
      temperature: {
        min: 37.5,
        max: 39.5,
      },
    },

    OLDER_ADULT: {
      heartRate: {
        min: 80,
        max: 120,
      },
      temperature: {
        min: 37.4,
        max: 39.3,
      },
    },
  },

  TYPHOID: {
    CHILD: {
      heartRate: {
        min: 80,
        max: 120,
      },
      temperature: {
        min: 37.5,
        max: 39.0,
      },
    },

    ADOLESCENT: {
      heartRate: {
        min: 75,
        max: 115,
      },
      temperature: {
        min: 37.5,
        max: 39.0,
      },
    },

    ADULT: {
      heartRate: {
        min: 75,
        max: 115,
      },
      temperature: {
        min: 37.5,
        max: 39.0,
      },
    },

    OLDER_ADULT: {
      heartRate: {
        min: 75,
        max: 115,
      },
      temperature: {
        min: 37.4,
        max: 38.8,
      },
    },
  },

  MALARIA_AND_TYPHOID: {
    CHILD: {
      heartRate: {
        min: 90,
        max: 130,
      },
      temperature: {
        min: 38.0,
        max: 40.0,
      },
    },

    ADOLESCENT: {
      heartRate: {
        min: 85,
        max: 125,
      },
      temperature: {
        min: 38.0,
        max: 40.0,
      },
    },

    ADULT: {
      heartRate: {
        min: 85,
        max: 125,
      },
      temperature: {
        min: 38.0,
        max: 40.0,
      },
    },

    OLDER_ADULT: {
      heartRate: {
        min: 85,
        max: 125,
      },
      temperature: {
        min: 37.8,
        max: 39.8,
      },
    },
  },
};

export function getAgeGroupFromAge(
  age: number
): AgeGroup {
  if (!Number.isFinite(age) || age < 0) {
    throw new Error(
      "Age must be a valid non-negative number."
    );
  }

  const ageGroup = HEALTH_AGE_GROUPS.find(
    (group) =>
      age >= group.minAge &&
      (group.maxAge === null ||
        age <= group.maxAge)
  );

  if (!ageGroup) {
    throw new Error(
      "No health simulation age group was found for this age."
    );
  }

  return ageGroup.value;
}