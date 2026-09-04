"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  UserCircle2,
} from "lucide-react";

import { usePatientDashboard } from "@/lib/hooks/patients/usePatients";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
}

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getInitials(
  firstName?: string,
  lastName?: string
) {
  const first = firstName?.trim().charAt(0) ?? "";
  const last = lastName?.trim().charAt(0) ?? "";

  const initials = `${first}${last}`.toUpperCase();

  return initials || "P";
}

function formatParameter(parameter: string) {
  return parameter
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function getAlertIcon(parameter: string) {
  if (parameter.toLowerCase().includes("heart")) {
    return HeartPulse;
  }

  if (
    parameter
      .toLowerCase()
      .includes("temperature")
  ) {
    return Thermometer;
  }

  return AlertTriangle;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PatientDashboardPage() {
  const {
    patient,
    readings,
    latestReading,
    activeAlerts,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = usePatientDashboard();

  /* ------------------------------------------------------------------------ */
  /* Derived dashboard values                                                */
  /* ------------------------------------------------------------------------ */

  const firstName =
    patient?.firstName?.trim() || "there";

  const fullName =
    patient?.firstName && patient?.lastName
      ? `${patient.firstName} ${patient.lastName}`
      : "Patient";

  const initials = getInitials(
    patient?.firstName,
    patient?.lastName
  );

  const totalReadings = readings.length;

  const activeAlertCount =
    activeAlerts.length;

  const hasActiveAlerts =
    activeAlertCount > 0;

  /*
   * The dashboard intentionally derives this status from
   * the backend's active-alert state rather than attempting
   * to medically interpret the actual vital-sign values.
   *
   * The backend remains the source of truth for alerts.
   */
  const healthStatus = hasActiveAlerts
    ? "Attention needed"
    : "No active alerts";

  const healthStatusDescription =
    hasActiveAlerts
      ? "You have health alerts that may require attention."
      : "No active health alerts have been reported.";

  const latestRecordedAt =
    latestReading?.recordedAt ?? null;

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                            */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Header skeleton */}
        <div className="mb-7">
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />

          <div className="mt-4 h-9 w-[min(560px,80%)] animate-pulse rounded-lg bg-white/10" />

          <div className="mt-3 h-4 w-[min(460px,70%)] animate-pulse rounded bg-white/5" />
        </div>

        {/* Status row skeleton */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="h-9 w-36 animate-pulse rounded-full bg-white/5" />
          <div className="h-9 w-44 animate-pulse rounded-full bg-white/5" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-[22px] border border-white/5 bg-white/[0.025]"
              />
            )
          )}
        </div>

        {/* Main content skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="h-[310px] animate-pulse rounded-[24px] border border-white/5 bg-white/[0.025]" />

          <div className="h-[310px] animate-pulse rounded-[24px] border border-white/5 bg-white/[0.025]" />
        </div>

        <div className="mt-6 h-[260px] animate-pulse rounded-[24px] border border-white/5 bg-white/[0.025]" />
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error state                                                              */
  /* ------------------------------------------------------------------------ */

  if (isError) {
    return (
      <div className="w-full">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-lg rounded-[28px] border border-red-400/10 bg-[#0E2723] p-7 text-center shadow-2xl shadow-black/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>

            <h1 className="mt-5 font-manrope text-xl font-bold tracking-tight text-white">
              Unable to load your dashboard
            </h1>

            <p className="mx-auto mt-2 max-w-md font-manrope text-sm leading-6 text-[#8FA8A2]">
              We couldn't retrieve your latest
              monitoring information. Please try
              again.
            </p>

            {error instanceof Error &&
              error.message && (
                <p className="mt-3 font-manrope text-xs text-red-300/70">
                  {error.message}
                </p>
              )}

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 font-manrope text-sm font-bold text-[#071A17] transition hover:bg-[#5eead4] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40 focus:ring-offset-2 focus:ring-offset-[#071A17]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Dashboard                                                                */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="w-full">
      {/* ================================================================== */}
      {/* PAGE HEADER                                                         */}
      {/* ================================================================== */}

      <div className="mb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/5 px-3 py-1.5">
              <Activity className="h-3.5 w-3.5 text-[#2DD4BF]" />

              <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.16em] text-[#8FA8A2]">
                Personal health monitoring
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
            </div>

            <h1 className="mt-4 font-manrope text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl lg:text-[34px]">
              Good day, {firstName}
            </h1>

            <p className="mt-2 max-w-2xl font-manrope text-sm leading-6 text-[#8FA8A2]">
              Here's an overview of your latest
              health information and monitoring
              activity.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5">
              <CalendarDays className="h-3.5 w-3.5 text-[#2DD4BF]" />

              <span className="font-manrope text-[11px] font-semibold text-[#8FA8A2]">
                {formatDate(new Date().toISOString(), {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {isFetching && (
              <div
                className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5"
                aria-label="Updating dashboard"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#2DD4BF]" />

                <span className="font-manrope text-[11px] font-semibold text-[#8FA8A2]">
                  Updating
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Patient identity/status row */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/5 px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2DD4BF]" />

            <span className="font-manrope text-[11px] text-[#8FA8A2]">
              Signed in as{" "}
              <span className="font-bold text-white">
                Patient
              </span>
            </span>
          </div>

          <div
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
              hasActiveAlerts
                ? "border-red-400/15 bg-red-400/5"
                : "border-[#2DD4BF]/15 bg-[#2DD4BF]/5",
            ].join(" ")}
          >
            {hasActiveAlerts ? (
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
            )}

            <span
              className={[
                "font-manrope text-[11px] font-semibold",
                hasActiveAlerts
                  ? "text-red-300"
                  : "text-[#8FA8A2]",
              ].join(" ")}
            >
              {healthStatus}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ERROR BANNER                                                        */}
      {/* ================================================================== */}

      {isError && (
        <div className="mb-6 rounded-2xl border border-red-400/10 bg-red-400/5 px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-400/10">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            </div>

            <div>
              <p className="font-manrope text-[12px] font-bold text-red-300">
                Unable to load dashboard data
              </p>

              <p className="mt-0.5 font-manrope text-[10px] text-red-300/70">
                {error instanceof Error
                  ? error.message
                  : "Please refresh the page and try again."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* PERSONAL METRICS                                                    */}
      {/* ================================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Heart rate */}
        <PatientMetricCard
          title="Heart rate"
          value={
            latestReading
              ? latestReading.heartRate
              : "—"
          }
          unit={
            latestReading ? "bpm" : undefined
          }
          subtitle={
            latestReading
              ? "Latest recorded reading"
              : "No reading available"
          }
          icon={
            <HeartPulse className="h-5 w-5" />
          }
          tone="blue"
        />

        {/* Temperature */}
        <PatientMetricCard
          title="Temperature"
          value={
            latestReading
              ? latestReading.temperature
              : "—"
          }
          unit={
            latestReading ? "°C" : undefined
          }
          subtitle={
            latestReading
              ? "Latest recorded reading"
              : "No reading available"
          }
          icon={
            <Thermometer className="h-5 w-5" />
          }
          tone="teal"
        />

        {/* Active alerts */}
        <PatientMetricCard
          title="Active alerts"
          value={activeAlertCount}
          subtitle={
            hasActiveAlerts
              ? "Requires your attention"
              : "No active alerts"
          }
          icon={
            <AlertTriangle className="h-5 w-5" />
          }
          tone={
            hasActiveAlerts
              ? "danger"
              : "teal"
          }
        />

        {/* Total readings */}
        <PatientMetricCard
          title="Health readings"
          value={totalReadings}
          subtitle="Recorded in your profile"
          icon={
            <Activity className="h-5 w-5" />
          }
          tone="blue"
        />
      </div>

      {/* ================================================================== */}
      {/* LATEST HEALTH + ALERTS                                              */}
      {/* ================================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        {/* Latest health reading */}
        <section className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
                <Activity className="h-4.5 w-4.5 text-[#2DD4BF]" />
              </div>

              <div>
                <h2 className="font-manrope text-sm font-bold text-white">
                  Latest health reading
                </h2>

                <p className="mt-0.5 font-manrope text-[10px] text-[#8FA8A2]">
                  Your most recently recorded vital
                  signs
                </p>
              </div>
            </div>

            {latestRecordedAt && (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Clock3 className="h-3.5 w-3.5 text-[#8FA8A2]" />

                <span className="font-manrope text-[10px] font-medium text-[#8FA8A2]">
                  {formatDateTime(
                    latestRecordedAt
                  )}
                </span>
              </div>
            )}
          </div>

          {latestReading ? (
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Heart rate */}
                <VitalCard
                  label="Heart rate"
                  value={latestReading.heartRate}
                  unit="bpm"
                  icon={
                    <HeartPulse className="h-4 w-4" />
                  }
                  tone="blue"
                />

                {/* Temperature */}
                <VitalCard
                  label="Temperature"
                  value={latestReading.temperature}
                  unit="°C"
                  icon={
                    <Thermometer className="h-4 w-4" />
                  }
                  tone="teal"
                />
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-manrope text-[10px] uppercase tracking-[0.12em] text-[#8FA8A2]">
                    Recorded
                  </p>

                  <p className="mt-1 font-manrope text-xs font-semibold text-white">
                    {formatDateTime(
                      latestReading.recordedAt
                    )}
                  </p>
                </div>

                <div>
                  <p className="font-manrope text-[10px] uppercase tracking-[0.12em] text-[#8FA8A2]">
                    Device
                  </p>

                  <p className="mt-1 max-w-[220px] truncate font-mono text-[10px] font-medium text-[#8FA8A2]">
                    {latestReading.deviceId}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={
                <Activity className="h-5 w-5" />
              }
              title="No health reading yet"
              description="Your latest health information will appear here once a reading has been recorded."
            />
          )}
        </section>

        {/* Active alerts */}
        <section className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  hasActiveAlerts
                    ? "bg-red-400/10"
                    : "bg-[#2DD4BF]/10",
                ].join(" ")}
              >
                {hasActiveAlerts ? (
                  <AlertTriangle className="h-4.5 w-4.5 text-red-400" />
                ) : (
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#2DD4BF]" />
                )}
              </div>

              <div>
                <h2 className="font-manrope text-sm font-bold text-white">
                  Active alerts
                </h2>

                <p className="mt-0.5 font-manrope text-[10px] text-[#8FA8A2]">
                  Monitoring notifications
                </p>
              </div>
            </div>

            <span
              className={[
                "inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 font-manrope text-[10px] font-bold",
                hasActiveAlerts
                  ? "bg-red-400/10 text-red-300"
                  : "bg-[#2DD4BF]/10 text-[#2DD4BF]",
              ].join(" ")}
            >
              {activeAlertCount}
            </span>
          </div>

          {hasActiveAlerts ? (
            <div className="space-y-2.5 p-4">
              {activeAlerts
                .slice(0, 4)
                .map((alert) => {
                  const AlertIcon =
                    getAlertIcon(
                      alert.parameter
                    );

                  return (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-3.5 transition hover:border-red-400/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
                          <AlertIcon className="h-4 w-4 text-red-400" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-manrope text-xs font-bold text-white">
                              {formatParameter(
                                alert.parameter
                              )}
                            </p>

                            <span className="shrink-0 font-manrope text-xs font-bold text-red-300">
                              {alert.value}
                            </span>
                          </div>

                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <span className="font-manrope text-[10px] text-[#8FA8A2]">
                              Active monitoring
                            </span>

                            <span className="font-manrope text-[9px] text-[#8FA8A2]/70">
                              {formatDateTime(
                                alert.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {activeAlerts.length > 4 && (
                <button
                  type="button"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-2.5 font-manrope text-[10px] font-bold text-[#8FA8A2] transition hover:border-white/15 hover:bg-white/[0.04] hover:text-white"
                >
                  View all alerts
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          ) : (
            <EmptyState
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              title="You're all clear"
              description="There are currently no active health alerts associated with your monitoring."
              compact
            />
          )}
        </section>
      </div>

      {/* ================================================================== */}
      {/* RECENT READINGS                                                     */}
      {/* ================================================================== */}

      <section className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2DD4BF]/10">
              <HeartPulse className="h-4.5 w-4.5 text-[#2DD4BF]" />
            </div>

            <div>
              <h2 className="font-manrope text-sm font-bold text-white">
                Recent health readings
              </h2>

              <p className="mt-0.5 font-manrope text-[10px] text-[#8FA8A2]">
                Your latest recorded monitoring data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-manrope text-[10px] font-medium text-[#8FA8A2]">
              {totalReadings}{" "}
              {totalReadings === 1
                ? "reading"
                : "readings"}
            </span>

            <ChevronRight className="h-3.5 w-3.5 text-[#8FA8A2]" />
          </div>
        </div>

        {readings.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[minmax(190px,1.4fr)_1fr_1fr_1.2fr] border-b border-white/5 px-6 py-3">
                  <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]">
                    Recorded
                  </span>

                  <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]">
                    Heart rate
                  </span>

                  <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]">
                    Temperature
                  </span>

                  <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]">
                    Device
                  </span>
                </div>

                <div className="divide-y divide-white/5">
                  {readings
                    .slice(0, 8)
                    .map((reading) => (
                      <div
                        key={reading.id}
                        className="grid grid-cols-[minmax(190px,1.4fr)_1fr_1fr_1.2fr] items-center px-6 py-3.5 transition hover:bg-white/[0.02]"
                      >
                        <div>
                          <p className="font-manrope text-xs font-semibold text-white">
                            {formatDate(
                              reading.recordedAt,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>

                          <p className="mt-0.5 font-manrope text-[9px] text-[#8FA8A2]">
                            {formatDate(
                              reading.recordedAt,
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-400/10">
                            <HeartPulse className="h-3.5 w-3.5 text-blue-300" />
                          </div>

                          <span className="font-manrope text-xs font-bold text-white">
                            {reading.heartRate}
                            <span className="ml-1 text-[9px] font-medium text-[#8FA8A2]">
                              bpm
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2DD4BF]/10">
                            <Thermometer className="h-3.5 w-3.5 text-[#2DD4BF]" />
                          </div>

                          <span className="font-manrope text-xs font-bold text-white">
                            {reading.temperature}
                            <span className="ml-1 text-[9px] font-medium text-[#8FA8A2]">
                              °C
                            </span>
                          </span>
                        </div>

                        <span className="truncate font-mono text-[9px] text-[#8FA8A2]">
                          {reading.deviceId}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2.5 p-4 md:hidden">
              {readings
                .slice(0, 8)
                .map((reading) => (
                  <div
                    key={reading.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-manrope text-xs font-bold text-white">
                          {formatDate(
                            reading.recordedAt,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>

                        <p className="mt-0.5 font-manrope text-[9px] text-[#8FA8A2]">
                          {formatDate(
                            reading.recordedAt,
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      <span className="rounded-full bg-white/5 px-2 py-1 font-manrope text-[9px] font-semibold text-[#8FA8A2]">
                        Reading
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <div className="flex items-center gap-2">
                          <HeartPulse className="h-3.5 w-3.5 text-blue-300" />

                          <span className="font-manrope text-[9px] font-semibold text-[#8FA8A2]">
                            Heart rate
                          </span>
                        </div>

                        <p className="mt-2 font-manrope text-base font-bold text-white">
                          {reading.heartRate}
                          <span className="ml-1 text-[9px] font-medium text-[#8FA8A2]">
                            bpm
                          </span>
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-3.5 w-3.5 text-[#2DD4BF]" />

                          <span className="font-manrope text-[9px] font-semibold text-[#8FA8A2]">
                            Temperature
                          </span>
                        </div>

                        <p className="mt-2 font-manrope text-base font-bold text-white">
                          {reading.temperature}
                          <span className="ml-1 text-[9px] font-medium text-[#8FA8A2]">
                            °C
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={
              <HeartPulse className="h-5 w-5" />
            }
            title="No readings available"
            description="Your recorded health readings will appear here when monitoring data becomes available."
          />
        )}
      </section>

      {/* ================================================================== */}
      {/* PATIENT PROFILE SUMMARY                                             */}
      {/* ================================================================== */}

      {patient && (
        <section className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.025] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2DD4BF]/10 font-manrope text-sm font-bold text-[#2DD4BF]">
                {initials}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-manrope text-sm font-bold text-white">
                    {fullName}
                  </h2>

                  <span className="rounded-full bg-[#2DD4BF]/10 px-2 py-0.5 font-manrope text-[8px] font-bold uppercase tracking-wide text-[#2DD4BF]">
                    Patient
                  </span>
                </div>

                <p className="mt-1 font-manrope text-[10px] text-[#8FA8A2]">
                  Your Remote Care profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#8FA8A2]">
              <UserCircle2 className="h-4 w-4" />

              <span className="font-manrope text-[10px] font-medium">
                Member since{" "}
                {formatDate(
                  patient.createdAt,
                  {
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <ProfileItem
              label="Email"
              value={patient.email}
            />

            <ProfileItem
              label="Contact"
              value={patient.contact}
            />

            <ProfileItem
              label="Gender"
              value={patient.gender}
            />

            <ProfileItem
              label="Date of birth"
              value={formatDate(
                patient.dateOfBirth
              )}
            />
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* FOOTER STATUS                                                       */}
      {/* ================================================================== */}

      <div className="mt-6 flex flex-col gap-2 border-t border-white/5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />

          <span className="font-manrope text-[9px] font-medium text-[#8FA8A2]">
            {isFetching
              ? "Updating monitoring data..."
              : "Monitoring data is up to date"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 self-start font-manrope text-[9px] font-bold text-[#8FA8A2] transition hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw
            className={[
              "h-3 w-3",
              isFetching
                ? "animate-spin"
                : "",
            ].join(" ")}
          />

          Refresh data

          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Patient metric card                                                        */
/* -------------------------------------------------------------------------- */

interface PatientMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: "blue" | "teal" | "danger";
}

function PatientMetricCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  tone,
}: PatientMetricCardProps) {
  const toneClasses = {
    blue: {
      icon: "bg-blue-400/10 text-blue-300",
      value: "text-white",
    },

    teal: {
      icon: "bg-[#2DD4BF]/10 text-[#2DD4BF]",
      value: "text-white",
    },

    danger: {
      icon: "bg-red-400/10 text-red-400",
      value: "text-red-300",
    },
  };

  const styles = toneClasses[tone];

  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5 transition duration-200 hover:border-white/15 hover:bg-white/[0.035]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-manrope text-[10px] font-medium text-[#8FA8A2]">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className={[
                "font-manrope text-[26px] font-bold tracking-[-0.03em]",
                styles.value,
              ].join(" ")}
            >
              {value}
            </span>

            {unit && (
              <span className="font-manrope text-[9px] font-medium text-[#8FA8A2]">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            styles.icon,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 truncate font-manrope text-[9px] text-[#8FA8A2]/80">
        {subtitle}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Vital card                                                                 */
/* -------------------------------------------------------------------------- */

interface VitalCardProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  tone: "blue" | "teal";
}

function VitalCard({
  label,
  value,
  unit,
  icon,
  tone,
}: VitalCardProps) {
  const iconClasses =
    tone === "blue"
      ? "bg-blue-400/10 text-blue-300"
      : "bg-[#2DD4BF]/10 text-[#2DD4BF]";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={[
              "flex h-8 w-8 items-center justify-center rounded-xl",
              iconClasses,
            ].join(" ")}
          >
            {icon}
          </div>

          <span className="font-manrope text-[10px] font-semibold text-[#8FA8A2]">
            {label}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-manrope text-3xl font-bold tracking-[-0.04em] text-white">
          {value}
        </span>

        <span className="font-manrope text-[10px] font-medium text-[#8FA8A2]">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  compact?: boolean;
}

function EmptyState({
  icon,
  title,
  description,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center px-6 text-center",
        compact ? "py-10" : "py-16",
      ].join(" ")}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2DD4BF]/10 text-[#2DD4BF]">
        {icon}
      </div>

      <h3 className="mt-4 font-manrope text-xs font-bold text-white">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm font-manrope text-[10px] leading-5 text-[#8FA8A2]">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile item                                                               */
/* -------------------------------------------------------------------------- */

interface ProfileItemProps {
  label: string;
  value: string;
}

function ProfileItem({
  label,
  value,
}: ProfileItemProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3.5">
      <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]">
        {label}
      </p>

      <p className="mt-1.5 truncate font-manrope text-xs font-semibold text-white">
        {value || "—"}
      </p>
    </div>
  );
}