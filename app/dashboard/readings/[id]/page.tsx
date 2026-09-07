"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cpu,
  HeartPulse,
  Mail,
  Phone,
  RefreshCw,
  ShieldAlert,
  Thermometer,
  User,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";

import { PageHero, PageShell } from "@/components/PageShell";
import { useReading } from "@/lib/hooks/readings/use-readings";
import type {
  ReadingAlert,
} from "@/lib/types/readings/readings";
import type { DeviceStatus } from '@/lib/types/devices/types';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value: string | undefined | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatRelativeTime(value: string | undefined | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const diff = Date.now() - date.getTime();

  if (diff < 0) return "Scheduled";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
}

function getPatientName(
  patient:
    | {
        firstName: string;
        lastName: string;
      }
    | undefined
): string {
  if (!patient) return "Unknown patient";

  return `${patient.firstName} ${patient.lastName}`.trim();
}

function getHeartRateStatus(
  heartRate: number
): {
  label: string;
  description: string;
  className: string;
  iconClassName: string;
} {
  if (heartRate < 60) {
    return {
      label: "Below typical range",
      description: "The recorded heart rate is below the typical adult range.",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
      iconClassName: "text-amber-300",
    };
  }

  if (heartRate > 100) {
    return {
      label: "Above typical range",
      description: "The recorded heart rate is above the typical adult range.",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
      iconClassName: "text-amber-300",
    };
  }

  return {
    label: "Within typical range",
    description: "The recorded heart rate is within the typical adult range.",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    iconClassName: "text-emerald-300",
  };
}

function getTemperatureStatus(
  temperature: number
): {
  label: string;
  description: string;
  className: string;
  iconClassName: string;
} {
  /*
   * The backend currently returns a numeric temperature without explicitly
   * documenting the unit. We therefore keep this presentation neutral and
   * avoid assuming Celsius/Fahrenheit here.
   */
  if (temperature < 36 || temperature > 38) {
    return {
      label: "Outside typical range",
      description:
        "The recorded temperature falls outside the configured reference range.",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
      iconClassName: "text-amber-300",
    };
  }

  return {
    label: "Within typical range",
    description:
      "The recorded temperature is within the configured reference range.",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    iconClassName: "text-emerald-300",
  };
}

function getAlertLabel(parameter: string): string {
  switch (parameter.toLowerCase()) {
    case "heart_rate":
      return "Heart rate";

    case "temperature":
      return "Temperature";

    default:
      return parameter
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
  }
}

function getAlertStatusClasses(status: string): string {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    case "RESOLVED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "DISMISSED":
      return "border-slate-400/20 bg-slate-400/10 text-slate-300";

    default:
      return "border-white/10 bg-white/5 text-[#8FA8A2]";
  }
}

function getDeviceStatusClasses(status: DeviceStatus): string {
  return status === "ACTIVE"
    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    : "border-white/10 bg-white/5 text-[#8FA8A2]";
}

/* -------------------------------------------------------------------------- */
/* Reusable UI                                                                */
/* -------------------------------------------------------------------------- */

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-6 border-b border-white/[0.06] py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-[#8FA8A2]">
            {icon}
          </div>
        )}

        <span className="text-sm text-[#8FA8A2]">{label}</span>
      </div>

      <div className="min-w-0 text-right text-sm font-medium text-white">
        {value}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  icon,
  status,
  statusClassName,
  description,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  status: string;
  statusClassName: string;
  description: string;
}) {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723] p-5 transition-colors hover:border-[#2DD4BF]/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#2DD4BF]/5 blur-3xl transition-opacity group-hover:opacity-100"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8FA8A2]">
              {label}
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight text-white">
                {value}
              </span>

              {unit && (
                <span className="pb-1 text-sm font-medium text-[#8FA8A2]">
                  {unit}
                </span>
              )}
            </div>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10 text-[#2DD4BF]">
            {icon}
          </div>
        </div>

        <div className="mt-5">
          <span
            className={[
              "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
              statusClassName,
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </span>

          <p className="mt-3 text-xs leading-5 text-[#8FA8A2]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 rounded-3xl border border-white/10 bg-[#0E2723]" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-3xl border border-white/10 bg-[#0E2723]" />
        <div className="h-48 rounded-3xl border border-white/10 bg-[#0E2723]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-3xl border border-white/10 bg-[#0E2723]" />
        <div className="h-80 rounded-3xl border border-white/10 bg-[#0E2723]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ReadingDetailPage() {
  const params = useParams();
  const router = useRouter();

  const readingId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : undefined;

  const {
    reading,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useReading(readingId);

  const patientName = useMemo(
    () => getPatientName(reading?.patient),
    [reading?.patient]
  );

  const heartRateStatus = useMemo(
    () =>
      reading
        ? getHeartRateStatus(reading.heartRate)
        : null,
    [reading]
  );

  const temperatureStatus = useMemo(
    () =>
      reading
        ? getTemperatureStatus(reading.temperature)
        : null,
    [reading]
  );

  const activeAlerts = useMemo(
    () =>
      reading?.alerts.filter(
        (alert) => alert.status.toUpperCase() === "ACTIVE"
      ) ?? [],
    [reading?.alerts]
  );

  if (isLoading) {
    return (
      <PageShell>
        <LoadingSkeleton />
      </PageShell>
    );
  }

  if (isError || !reading) {
    return (
      <PageShell>
        <PageHero
          eyebrow="Health Monitoring"
          title="Reading unavailable"
          description="We could not retrieve this health reading. It may no longer exist or may be temporarily unavailable."
          backHref="/dashboard/readings"
          icon={<Activity className="h-5 w-5 text-[#2DD4BF]" />}
        />

        <section className="mt-6 rounded-3xl border border-red-400/20 bg-[#0E2723] p-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
                <AlertCircle className="h-5 w-5 text-red-300" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Unable to load reading
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-[#8FA8A2]">
                  {error?.message ??
                    "An unexpected error occurred while retrieving the reading."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <PageHero
        eyebrow="Health Monitoring"
        title="Health Reading Details"
        description={`Detailed monitoring record for ${patientName}.`}
        backHref="/dashboard/readings"
        icon={<Activity className="h-5 w-5 text-[#2DD4BF]" />}
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30"
          >
            <RefreshCw
              className={[
                "h-4 w-4",
                isFetching ? "animate-spin" : "",
              ].join(" ")}
            />
            Refresh
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Reading overview                                                   */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723]">
        <div className="border-b border-white/[0.06] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#2DD4BF]" />

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8FA8A2]">
                  Reading snapshot
                </p>
              </div>

              <h2 className="mt-2 text-lg font-bold text-white">
                Latest recorded measurements
              </h2>

              <p className="mt-1 text-sm text-[#8FA8A2]">
                Captured {formatRelativeTime(reading.recordedAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#2DD4BF]/15 bg-[#2DD4BF]/10 px-3 py-1.5 text-xs font-semibold text-[#2DD4BF]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Reading recorded
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/[0.06] md:grid-cols-2">
          <MetricCard
            label="Heart Rate"
            value={reading.heartRate}
            unit="bpm"
            icon={<HeartPulse className="h-5 w-5" />}
            status={heartRateStatus?.label ?? "Unknown"}
            statusClassName={heartRateStatus?.className ?? ""}
            description={
              heartRateStatus?.description ??
              "Heart-rate measurement recorded by the monitoring device."
            }
          />

          <MetricCard
            label="Temperature"
            value={reading.temperature}
            icon={<Thermometer className="h-5 w-5" />}
            status={temperatureStatus?.label ?? "Unknown"}
            statusClassName={temperatureStatus?.className ?? ""}
            description={
              temperatureStatus?.description ??
              "Temperature measurement recorded by the monitoring device."
            }
          />
        </div>

        <div className="border-t border-white/[0.06] bg-[#0b211e] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[#8FA8A2]">
              <Clock3 className="h-4 w-4" />
              Recorded at
            </div>

            <span className="font-medium text-white">
              {formatDate(reading.recordedAt)}
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Patient + Device                                                   */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Patient */}

        <section className="rounded-3xl border border-white/10 bg-[#0E2723]">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
                <User className="h-5 w-5 text-[#2DD4BF]" />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Patient Information
                </h2>

                <p className="mt-0.5 text-xs text-[#8FA8A2]">
                  Patient associated with this reading
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/patients/${reading.patient.id}`
                )
              }
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2DD4BF] transition hover:bg-[#2DD4BF]/10 sm:inline-flex"
            >
              View patient
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2DD4BF]/10 text-[#2DD4BF]">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-bold text-white">
                  {patientName}
                </p>

                <p className="mt-0.5 truncate text-xs text-[#8FA8A2]">
                  Patient ID: {reading.patient.id}
                </p>
              </div>
            </div>

            <div>
              <DetailRow
                label="Email"
                value={reading.patient.email}
                icon={<Mail className="h-4 w-4" />}
              />

              <DetailRow
                label="Contact"
                value={reading.patient.contact}
                icon={<Phone className="h-4 w-4" />}
              />

              <DetailRow
                label="Date of birth"
                value={formatDate(reading.patient.dateOfBirth)}
                icon={<CalendarDays className="h-4 w-4" />}
              />

              <DetailRow
                label="Gender"
                value={reading.patient.gender}
                icon={<UserRound className="h-4 w-4" />}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/patients/${reading.patient.id}`
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] sm:hidden"
            >
              View patient profile
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </section>

        {/* Device */}

        <section className="rounded-3xl border border-white/10 bg-[#0E2723]">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
                <Cpu className="h-5 w-5 text-[#2DD4BF]" />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Monitoring Device
                </h2>

                <p className="mt-0.5 text-xs text-[#8FA8A2]">
                  Device that captured this reading
                </p>
              </div>
            </div>

            <span
              className={[
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
                getDeviceStatusClasses(reading.device.status),
              ].join(" ")}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {reading.device.status}
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-[#8FA8A2]">
                <Cpu className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-bold text-white">
                  {reading.device.deviceName}
                </p>

                <p className="mt-0.5 truncate text-xs text-[#8FA8A2]">
                  Device ID: {reading.device.id}
                </p>
              </div>
            </div>

            <div>
              <DetailRow
                label="Device name"
                value={reading.device.deviceName}
                icon={<Cpu className="h-4 w-4" />}
              />

              <DetailRow
                label="Status"
                value={
                  <span
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
                      getDeviceStatusClasses(reading.device.status),
                    ].join(" ")}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {reading.device.status}
                  </span>
                }
              />

              <DetailRow
                label="Registered"
                value={formatDate(reading.device.createdAt)}
                icon={<CalendarDays className="h-4 w-4" />}
              />

              <DetailRow
                label="Reading ID"
                value={
                  <span
                    title={reading.id}
                    className="block max-w-[180px] truncate font-mono text-xs text-[#8FA8A2]"
                  >
                    {reading.id}
                  </span>
                }
              />
            </div>
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Alerts                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723]">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div
              className={[
                "flex h-10 w-10 items-center justify-center rounded-2xl border",
                activeAlerts.length > 0
                  ? "border-red-400/20 bg-red-400/10"
                  : "border-emerald-400/20 bg-emerald-400/10",
              ].join(" ")}
            >
              {activeAlerts.length > 0 ? (
                <ShieldAlert className="h-5 w-5 text-red-300" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              )}
            </div>

            <div>
              <h2 className="font-bold text-white">
                Reading Alerts
              </h2>

              <p className="mt-0.5 text-xs text-[#8FA8A2]">
                Alerts generated from this health reading
              </p>
            </div>
          </div>

          <div
            className={[
              "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
              activeAlerts.length > 0
                ? "border-red-400/20 bg-red-400/10 text-red-300"
                : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
            ].join(" ")}
          >
            {activeAlerts.length > 0
              ? `${activeAlerts.length} active alert${
                  activeAlerts.length === 1 ? "" : "s"
                }`
              : "No active alerts"}
          </div>
        </div>

        {reading.alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-300" />
            </div>

            <h3 className="mt-4 font-semibold text-white">
              No alerts for this reading
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-[#8FA8A2]">
              This health reading did not generate any alerts.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {reading.alerts.map((alert: ReadingAlert) => {
              const isActive =
                alert.status.toUpperCase() === "ACTIVE";

              return (
                <div
                  key={alert.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                        isActive
                          ? "border-red-400/20 bg-red-400/10"
                          : "border-white/10 bg-white/[0.03]",
                      ].join(" ")}
                    >
                      <AlertCircle
                        className={[
                          "h-5 w-5",
                          isActive
                            ? "text-red-300"
                            : "text-[#8FA8A2]",
                        ].join(" ")}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {getAlertLabel(alert.parameter)}
                        </h3>

                        <span
                          className={[
                            "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            getAlertStatusClasses(alert.status),
                          ].join(" ")}
                        >
                          {alert.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#8FA8A2]">
                        Recorded value:{" "}
                        <span className="font-semibold text-white">
                          {alert.value}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-[#647f78]">
                        Created {formatRelativeTime(alert.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-xs text-[#647f78]">
                      Alert created
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#8FA8A2]">
                      {formatDate(alert.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Record metadata                                                     */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-6 rounded-3xl border border-white/10 bg-[#0E2723] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Activity className="h-5 w-5 text-[#8FA8A2]" />
          </div>

          <div>
            <h2 className="font-bold text-white">
              Record Information
            </h2>

            <p className="mt-0.5 text-xs text-[#8FA8A2]">
              Technical identifiers for this monitoring record
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#647f78]">
              Reading ID
            </p>

            <p
              title={reading.id}
              className="mt-2 truncate font-mono text-xs text-[#8FA8A2]"
            >
              {reading.id}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#647f78]">
              Patient ID
            </p>

            <p
              title={reading.patientId}
              className="mt-2 truncate font-mono text-xs text-[#8FA8A2]"
            >
              {reading.patientId}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#647f78]">
              Device ID
            </p>

            <p
              title={reading.deviceId}
              className="mt-2 truncate font-mono text-xs text-[#8FA8A2]"
            >
              {reading.deviceId}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer note                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.035] p-4">
        <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]" />

        <p className="text-xs leading-5 text-[#8FA8A2]">
          This page provides a read-only view of a health monitoring
          record. Measurements and alerts shown here are retrieved
          directly from the Remote Care monitoring system.
        </p>
      </div>
    </PageShell>
  );
}