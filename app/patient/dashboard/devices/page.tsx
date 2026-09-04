"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Cpu,
  HeartPulse,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";

import { PageShell, PageHero } from "@/components/PageShell";

import { usePatientDashboard } from "@/lib/hooks/patients/usePatients";
import { useDevices } from "@/lib/hooks/devices/useDevices";
import { useCreateHealthReading } from "@/lib/hooks/readings/useReadings";

import {
  HEALTH_CONDITION_OPTIONS,
  getHealthSimulationRange,
  getAgeGroupFromAge,
  HEALTH_AGE_GROUPS,
} from "@/lib/data/health-simulation";

import { generateHealthReading } from "@/lib/utils/health-simulation";

import type {
  HealthCondition,
  HealthSimulationRange,
} from "@/lib/types/health-simulation/types";

import type { Device } from "@/lib/types/devices/types";

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return Math.max(0, age);
}

function formatTemperature(value: number) {
  return `${value.toFixed(1)}°C`;
}

function getConditionIcon(condition: HealthCondition) {
  switch (condition) {
    case "HYPERTENSION":
      return Activity;

    case "MALARIA":
      return Thermometer;

    case "TYPHOID":
      return Thermometer;

    case "MALARIA_AND_TYPHOID":
      return HeartPulse;

    case "HEALTHY":
    default:
      return ShieldCheck;
  }
}

function DeviceStatus({
  status,
}: {
  status: Device["status"];
}) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-[11px] font-semibold tracking-wide",
        isActive
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-white/10 bg-white/5 text-slate-400",
      ].join(" ")}
    >
      {isActive ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}

      {isActive ? "Ready" : "Inactive"}
    </span>
  );
}

function MetricPreview({
  icon: Icon,
  label,
  value,
  range,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: string;
  range: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071A17]/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
          <Icon className="h-4 w-4 text-[#2DD4BF]" />
        </div>

        <span className="text-[11px] font-medium text-[#8FA8A2]">
          Simulated
        </span>
      </div>

      <p className="text-xs text-[#8FA8A2]">{label}</p>

      <p className="mt-1 text-xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        Expected: {range}
      </p>
    </div>
  );
}

export default function PatientDevicesPage() {
  const {
    patient,
    isLoading: isPatientLoading,
    isError: isPatientError,
    error: patientError,
    refetch: refetchPatient,
  } = usePatientDashboard();

  const {
    devices,
    isLoading: isDevicesLoading,
    isFetching: isDevicesFetching,
    isError: isDevicesError,
    error: devicesError,
    refetch: refetchDevices,
  } = useDevices({
    limit: 100,
  });

  const {
    createReading,
    isCreating,
    isError: isCreateError,
    error: createError,
    reset: resetCreateMutation,
  } = useCreateHealthReading();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [selectedCondition, setSelectedCondition] =
    useState<HealthCondition>("HEALTHY");

  const [generatedReading, setGeneratedReading] = useState<{
    heartRate: number;
    temperature: number;
  } | null>(null);

  const activeDevices = useMemo(
    () => devices.filter((device) => device.status === "ACTIVE"),
    [devices]
  );

  const age = useMemo(() => {
    if (!patient?.dateOfBirth) return 0;

    return calculateAge(patient.dateOfBirth);
  }, [patient?.dateOfBirth]);

  const ageGroup = useMemo(() => {
    if (!age) return null;

    return getAgeGroupFromAge(age);
    }, [age]);

    const ageGroupDefinition = useMemo(() => {
    if (!ageGroup) return null;

    return HEALTH_AGE_GROUPS.find(
        (group) => group.value === ageGroup
    ) ?? null;
    }, [ageGroup]);

  const selectedDevice = useMemo(
    () =>
      activeDevices.find(
        (device) => device.id === selectedDeviceId
      ) ?? null,
    [activeDevices, selectedDeviceId]
  );

  const selectedConditionDefinition = useMemo(
    () =>
      HEALTH_CONDITION_OPTIONS.find(
        (condition) => condition.value === selectedCondition
      ),
    [selectedCondition]
  );

  const simulationRange = useMemo(() => {
    if (!ageGroup) return null;

    try {
        return getHealthSimulationRange(
        selectedCondition,
        ageGroup
        );
    } catch {
        return null;
    }
    }, [selectedCondition, ageGroup]);

  const ConditionIcon = getConditionIcon(selectedCondition);

  const isInitialLoading =
    isPatientLoading || isDevicesLoading;

  const hasPageError =
    isPatientError || isDevicesError;

  function handleGenerateReading() {
    if (!patient) {
      toast.error("Patient information is not available.");
      return;
    }

    if (!selectedDevice) {
      toast.error("Please select an active device first.");
      return;
    }

    if (!simulationRange) {
      toast.error(
        "A health simulation range could not be determined."
      );
      return;
    }

    resetCreateMutation();

    const reading = generateHealthReading(simulationRange);

    setGeneratedReading(reading);
  }

  async function handleSubmitReading() {
    if (!patient) {
      toast.error("Patient information is not available.");
      return;
    }

    if (!selectedDevice) {
      toast.error("Please select an active device.");
      return;
    }

    if (!generatedReading) {
      toast.error("Generate a health reading first.");
      return;
    }

    try {
      await createReading({
        patientId: patient.id,
        deviceId: selectedDevice.id,
        heartRate: generatedReading.heartRate,
        temperature: generatedReading.temperature,
      });

      toast.success("Health reading submitted successfully.", {
        description:
          "Your latest health data has been sent for monitoring.",
      });

      setGeneratedReading(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit the health reading.";

      toast.error("Submission failed", {
        description: message,
      });
    }
  }

  async function handleRefresh() {
    await Promise.all([
      refetchPatient(),
      refetchDevices(),
    ]);
  }

  if (isInitialLoading) {
    return (
      <PageShell>
        <PageHero
          title="Health readings"
          description="Connect a device and submit your latest health measurements."
        />

        <div className="mt-8 space-y-6">
          <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-[#0E2723]" />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-[#0E2723]" />
            <div className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-[#0E2723]" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (hasPageError) {
    return (
      <PageShell>
        <PageHero
          title="Health readings"
          description="Connect a device and submit your latest health measurements."
        />

        <div className="mt-8 flex min-h-[360px] items-center justify-center rounded-3xl border border-red-400/10 bg-[#0E2723] px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10">
              <AlertCircle className="h-7 w-7 text-red-300" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-white">
              Unable to load health monitoring
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8FA8A2]">
              {patientError?.message ??
                devicesError?.message ??
                "Something went wrong while loading your health monitoring data."}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 py-2.5 text-sm font-bold text-[#071A17] transition hover:bg-[#5eead4] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        title="Health readings"
        description="Use an active Remote Care device to generate and submit your latest health measurements."
      />

      <div className="mt-8 space-y-6">
        {/* Patient context */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723]">
          <div className="relative p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#2DD4BF]/5 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2DD4BF]/10 ring-1 ring-[#2DD4BF]/10">
                  <UserRound className="h-5 w-5 text-[#2DD4BF]" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8FA8A2]">
                    Patient profile
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-white">
                    {patient?.firstName} {patient?.lastName}
                  </h2>

                  <p className="mt-0.5 text-sm text-[#8FA8A2]">
                    Age {age}
                    {ageGroupDefinition
                        ? ` • ${ageGroupDefinition.label}`
                        : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/5 px-3 py-1.5 sm:self-auto">
                <span className="h-2 w-2 rounded-full bg-[#2DD4BF] shadow-[0_0_10px_rgba(45,212,191,0.7)]" />

                <span className="text-xs font-semibold text-[#9ee8dc]">
                  Monitoring enabled
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main workspace */}
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          {/* Left: device + condition */}
          <section className="rounded-3xl border border-white/10 bg-[#0E2723]">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
                      <Cpu className="h-4 w-4 text-[#2DD4BF]" />
                    </div>

                    <h2 className="font-bold text-white">
                      Reading setup
                    </h2>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#8FA8A2]">
                    Select an active device and the health condition
                    you want this reading to represent.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isDevicesFetching}
                  aria-label="Refresh devices"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#8FA8A2] transition hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/5 hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={[
                      "h-4 w-4",
                      isDevicesFetching && "animate-spin",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-6">
              {/* Devices */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-white">
                      Monitoring device
                    </label>

                    <p className="mt-1 text-xs text-[#8FA8A2]">
                      Only active devices can be used.
                    </p>
                  </div>

                  <span className="text-xs text-slate-500">
                    {activeDevices.length} available
                  </span>
                </div>

                {activeDevices.length === 0 ? (
                  <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
                        <AlertCircle className="h-4 w-4 text-amber-300" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          No active devices
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#8FA8A2]">
                          There are currently no active monitoring
                          devices available. Please contact your
                          healthcare administrator.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {activeDevices.map((device) => {
                      const isSelected =
                        selectedDeviceId === device.id;

                      return (
                        <button
                          key={device.id}
                          type="button"
                          onClick={() => {
                            setSelectedDeviceId(device.id);
                            setGeneratedReading(null);
                          }}
                          className={[
                            "group w-full rounded-2xl border p-4 text-left transition",
                            "focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30",
                            isSelected
                              ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/[0.07]"
                              : "border-white/10 bg-[#071A17]/50 hover:border-white/20 hover:bg-[#071A17]/80",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={[
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                                isSelected
                                  ? "bg-[#2DD4BF]/15"
                                  : "bg-white/5",
                              ].join(" ")}
                            >
                              <Cpu
                                className={[
                                  "h-5 w-5",
                                  isSelected
                                    ? "text-[#2DD4BF]"
                                    : "text-[#8FA8A2]",
                                ].join(" ")}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-sm font-semibold text-white">
                                  {device.deviceName}
                                </p>

                                <DeviceStatus
                                  status={device.status}
                                />
                              </div>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                Device ID: {device.id}
                              </p>
                            </div>

                            <div
                              className={[
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                                isSelected
                                  ? "border-[#2DD4BF] bg-[#2DD4BF]"
                                  : "border-white/15 bg-transparent",
                              ].join(" ")}
                            >
                              {isSelected && (
                                <CheckCircle2 className="h-4 w-4 text-[#071A17]" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Conditions */}
              <div>
                <div className="mb-3">
                  <label className="text-sm font-semibold text-white">
                    Health condition
                  </label>

                  <p className="mt-1 text-xs text-[#8FA8A2]">
                    Choose the condition being monitored.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {HEALTH_CONDITION_OPTIONS.map((condition) => {
                    const isSelected =
                      selectedCondition === condition.value;

                    const Icon = getConditionIcon(
                      condition.value
                    );

                    return (
                      <button
                        key={condition.value}
                        type="button"
                        onClick={() => {
                          setSelectedCondition(
                            condition.value
                          );
                          setGeneratedReading(null);
                        }}
                        className={[
                          "group rounded-2xl border p-4 text-left transition",
                          "focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30",
                          isSelected
                            ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/[0.07]"
                            : "border-white/10 bg-[#071A17]/50 hover:border-white/20 hover:bg-[#071A17]/80",
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={[
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                              isSelected
                                ? "bg-[#2DD4BF]/15"
                                : "bg-white/5",
                            ].join(" ")}
                          >
                            <Icon
                              className={[
                                "h-4 w-4",
                                isSelected
                                  ? "text-[#2DD4BF]"
                                  : "text-[#8FA8A2]",
                              ].join(" ")}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white">
                              {condition.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#8FA8A2]">
                              {condition.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Right: preview */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723]">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
                  <HeartPulse className="h-4 w-4 text-[#2DD4BF]" />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Reading preview
                  </h2>

                  <p className="mt-1 text-xs text-[#8FA8A2]">
                    Review your simulated measurements before
                    submission.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* Selected condition */}
              <div className="rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
                    <ConditionIcon className="h-5 w-5 text-[#2DD4BF]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#8FA8A2]">
                      Selected condition
                    </p>

                    <p className="mt-0.5 truncate text-sm font-bold text-white">
                      {selectedConditionDefinition?.label ??
                        "Healthy"}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              </div>

              {/* Range */}
              {simulationRange ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MetricPreview
                    icon={HeartPulse}
                    label="Heart rate"
                    value={
                      generatedReading
                        ? `${generatedReading.heartRate} BPM`
                        : `${simulationRange.heartRate.min}–${simulationRange.heartRate.max} BPM`
                    }
                    range={`${simulationRange.heartRate.min}–${simulationRange.heartRate.max} BPM`}
                  />

                  <MetricPreview
                    icon={Thermometer}
                    label="Temperature"
                    value={
                      generatedReading
                        ? formatTemperature(
                            generatedReading.temperature
                          )
                        : `${simulationRange.temperature.min.toFixed(
                            1
                          )}–${simulationRange.temperature.max.toFixed(
                            1
                          )}°C`
                    }
                    range={`${simulationRange.temperature.min.toFixed(
                      1
                    )}–${simulationRange.temperature.max.toFixed(
                      1
                    )}°C`}
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#071A17]/60 p-5 text-center">
                  <AlertCircle className="mx-auto h-5 w-5 text-amber-300" />

                  <p className="mt-3 text-sm font-semibold text-white">
                    Reading range unavailable
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#8FA8A2]">
                    We could not determine the appropriate
                    simulation range for this patient.
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#071A17]/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2DD4BF]/10">
                    <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {generatedReading
                        ? "Reading generated"
                        : "Ready to generate"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#8FA8A2]">
                      {generatedReading
                        ? "The values below are ready to be submitted to your Remote Care monitoring record."
                        : "Generate a new reading when your device and health condition are selected."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission error */}
              {isCreateError && createError && (
                <div className="mt-4 rounded-2xl border border-red-400/10 bg-red-400/5 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />

                    <div>
                      <p className="text-sm font-semibold text-red-200">
                        Could not submit reading
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-200/70">
                        {createError.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 space-y-3">
                {!generatedReading ? (
                  <button
                    type="button"
                    onClick={handleGenerateReading}
                    disabled={
                      !selectedDevice ||
                      !simulationRange ||
                      isCreating
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-4 py-3 text-sm font-bold text-[#071A17] shadow-lg shadow-[#2DD4BF]/10 transition hover:bg-[#5eead4] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40"
                  >
                    <Activity className="h-4 w-4" />
                    Generate health reading
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSubmitReading}
                      disabled={isCreating}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-4 py-3 text-sm font-bold text-[#071A17] shadow-lg shadow-[#2DD4BF]/10 transition hover:bg-[#5eead4] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting reading...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Submit health reading
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGeneratedReading(null);
                        resetCreateMutation();
                      }}
                      disabled={isCreating}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#8FA8A2] transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Generate another reading
                    </button>
                  </>
                )}
              </div>

              <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
                Health readings generated by this interface are
                simulated values for Remote Care monitoring and
                demonstration purposes. They should not be used
                as a substitute for professional medical
                assessment.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom information */}
        <section className="rounded-3xl border border-white/10 bg-[#0E2723] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
                <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Remote monitoring
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-[#8FA8A2]">
                  Submitted readings are attached to your patient
                  record and can be used by authorized healthcare
                  staff for monitoring and follow-up.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs text-[#8FA8A2]">
              <span className="h-2 w-2 rounded-full bg-[#2DD4BF]" />
              Secure connection
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}