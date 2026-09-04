"use client";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  Cpu,
  Heart,
  HeartPulse,
  // Loader2,
  Mail,
  Phone,
  RefreshCw,
  ShieldAlert,
  Thermometer,
  UserRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { usePatient } from "@/lib/hooks/patients/usePatient";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(
  date: string | null | undefined
) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatDateTime(
  date: string | null | undefined
) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

function getInitials(
  firstName: string,
  lastName: string
) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`
    .toUpperCase();
}

function getFullName(
  firstName: string,
  lastName: string
) {
  return `${firstName} ${lastName}`.trim();
}

function formatParameter(
  parameter: string
) {
  return parameter
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatValue(
  parameter: string,
  value: number
) {
  if (parameter === "heart_rate") {
    return `${value} bpm`;
  }

  if (parameter === "temperature") {
    return `${value} °F`;
  }

  return String(value);
}

/* -------------------------------------------------------------------------- */
/* Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

function PatientDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {/* Profile skeleton */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0E2723] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/[0.06]" />

          <div className="flex-1 space-y-2.5">
            <div className="h-5 w-40 rounded bg-white/[0.06]" />
            <div className="h-3 w-52 rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 rounded-xl bg-white/[0.035]"
            />
          ))}
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 rounded-2xl bg-[#0E2723]"
          />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="h-80 rounded-2xl bg-[#0E2723]" />
        <div className="h-80 rounded-2xl bg-[#0E2723]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Patient information item                                                   */
/* -------------------------------------------------------------------------- */

function PatientInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.018] px-3.5 py-3">
      <div className="flex items-center gap-2">
        <span className="text-[#8FA8A2]/70">
          {icon}
        </span>

        <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]/60">
          {label}
        </p>
      </div>

      <p className="mt-1.5 truncate font-manrope text-[11px] font-semibold text-[#DCE8E5]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric card                                                                */
/* -------------------------------------------------------------------------- */

function MetricCard({
  icon,
  label,
  value,
  description,
  tone = "teal",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone?: "teal" | "danger" | "blue";
}) {
  const iconClass =
    tone === "danger"
      ? "bg-red-400/[0.07] text-red-400"
      : tone === "blue"
        ? "bg-sky-400/[0.07] text-sky-400"
        : "bg-[#2DD4BF]/[0.07] text-[#2DD4BF]";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0E2723] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]/65">
            {label}
          </p>

          <p className="mt-2 font-manrope text-2xl font-extrabold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 font-manrope text-[9px] text-[#8FA8A2]/70">
            {description}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Latest reading                                                             */
/* -------------------------------------------------------------------------- */

function LatestReadingCard({
  reading,
}: {
  reading:
    | {
        id: string;
        patientId: string;
        deviceId: string;
        heartRate: number;
        temperature: number;
        recordedAt: string;
      }
    | null;
}) {
  if (!reading) {
    return (
      <section className="rounded-2xl border border-white/[0.07] bg-[#0E2723]">
        <SectionHeader
          icon={
            <HeartPulse className="h-4 w-4" />
          }
          title="Latest health reading"
          description="Most recent reading received from the patient's device."
        />

        <div className="flex min-h-[250px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.035]">
              <Activity className="h-5 w-5 text-[#8FA8A2]/60" />
            </div>

            <p className="mt-3 font-manrope text-[11px] font-semibold text-white/80">
              No health readings available
            </p>

            <p className="mt-1 font-manrope text-[9px] text-[#8FA8A2]/60">
              A reading will appear here when the patient&apos;s
              device reports new data.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0E2723]">
      <SectionHeader
        icon={
          <HeartPulse className="h-4 w-4" />
        }
        title="Latest health reading"
        description="Most recent reading received from the patient's device."
      />

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-manrope text-[9px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]/60">
              Recorded
            </p>

            <p className="mt-1 font-manrope text-[10px] font-semibold text-white/80">
              {formatDateTime(
                reading.recordedAt
              )}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.05] px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
            <span className="font-manrope text-[9px] font-bold text-[#2DD4BF]">
              Latest
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <VitalCard
            icon={
              <Heart className="h-4 w-4" />
            }
            label="Heart rate"
            value={`${reading.heartRate}`}
            unit="bpm"
          />

          <VitalCard
            icon={
              <Thermometer className="h-4 w-4" />
            }
            label="Temperature"
            value={`${reading.temperature}`}
            unit="°F"
          />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.018] px-3.5 py-3">
          <Cpu className="h-3.5 w-3.5 shrink-0 text-[#8FA8A2]/60" />

          <div className="min-w-0">
            <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]/55">
              Monitoring device
            </p>

            <p className="mt-0.5 truncate font-manrope text-[9px] text-[#B8C9C4]">
              {reading.deviceId}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Vital card                                                                 */
/* -------------------------------------------------------------------------- */

function VitalCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#071A17] p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2DD4BF]/[0.07] text-[#2DD4BF]">
          {icon}
        </div>

        <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]/70">
          {label}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-manrope text-2xl font-extrabold tracking-tight text-white">
          {value}
        </span>

        <span className="font-manrope text-[10px] font-semibold text-[#8FA8A2]">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Active alerts                                                               */
/* -------------------------------------------------------------------------- */

function ActiveAlertsCard({
  alerts,
}: {
  alerts: Array<{
    id: string;
    patientId: string;
    readingId: string;
    parameter: string;
    value: number;
    status: string;
    createdAt: string;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0E2723]">
      <SectionHeader
        icon={
          <ShieldAlert className="h-4 w-4" />
        }
        title="Active alerts"
        description="Alerts currently requiring attention."
        badge={
          alerts.length > 0
            ? String(alerts.length)
            : undefined
        }
      />

      {alerts.length === 0 ? (
        <div className="flex min-h-[250px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#2DD4BF]/[0.05]">
              <CheckCircle2 className="h-5 w-5 text-[#2DD4BF]/80" />
            </div>

            <p className="mt-3 font-manrope text-[11px] font-semibold text-white/80">
              No active alerts
            </p>

            <p className="mt-1 font-manrope text-[9px] text-[#8FA8A2]/60">
              There are currently no active health alerts
              for this patient.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.05]">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="px-5 py-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/[0.07]">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-manrope text-[11px] font-bold capitalize text-white">
                      {formatParameter(
                        alert.parameter
                      )}
                    </p>

                    <span className="rounded-md bg-red-400/[0.07] px-2 py-1 font-manrope text-[8px] font-bold uppercase tracking-[0.08em] text-red-300">
                      {alert.status}
                    </span>
                  </div>

                  <p className="mt-1 font-manrope text-[11px] font-semibold text-red-300">
                    {formatValue(
                      alert.parameter,
                      alert.value
                    )}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-[#8FA8A2]/60">
                    <Clock3 className="h-3 w-3" />

                    <span className="font-manrope text-[8px]">
                      {formatDateTime(
                        alert.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Readings history                                                           */
/* -------------------------------------------------------------------------- */

function ReadingsHistory({
  readings,
}: {
  readings: Array<{
    id: string;
    patientId: string;
    deviceId: string;
    heartRate: number;
    temperature: number;
    recordedAt: string;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0E2723]">
      <SectionHeader
        icon={
          <Activity className="h-4 w-4" />
        }
        title="Reading history"
        description="Health readings associated with this patient."
      />

      {readings.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <Activity className="mx-auto h-5 w-5 text-[#8FA8A2]/50" />

            <p className="mt-3 font-manrope text-[11px] font-semibold text-white/75">
              No reading history
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-4 border-b border-white/[0.06] bg-white/[0.015] px-5 py-3">
              <TableHeading>
                Recorded
              </TableHeading>

              <TableHeading>
                Heart rate
              </TableHeading>

              <TableHeading>
                Temperature
              </TableHeading>

              <TableHeading>
                Device
              </TableHeading>
            </div>

            {readings.map((reading) => (
              <div
                key={reading.id}
                className="grid grid-cols-[1.1fr_1fr_1fr_1fr] items-center gap-4 border-b border-white/[0.05] px-5 py-3.5 last:border-b-0"
              >
                <div>
                  <p className="font-manrope text-[10px] font-semibold text-white/80">
                    {formatDate(
                      reading.recordedAt
                    )}
                  </p>

                  <p className="mt-0.5 font-manrope text-[8px] text-[#8FA8A2]/60">
                    {new Intl.DateTimeFormat(
                      "en-NG",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    ).format(
                      new Date(
                        reading.recordedAt
                      )
                    )}
                  </p>
                </div>

                <span className="font-manrope text-[10px] font-semibold text-[#D5E2DE]">
                  {reading.heartRate} bpm
                </span>

                <span className="font-manrope text-[10px] font-semibold text-[#D5E2DE]">
                  {reading.temperature} °F
                </span>

                <span className="truncate font-manrope text-[9px] text-[#8FA8A2]">
                  {reading.deviceId}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="divide-y divide-white/[0.05] md:hidden">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-manrope text-[10px] font-semibold text-white/85">
                      {formatDateTime(
                        reading.recordedAt
                      )}
                    </p>

                    <p className="mt-1 truncate font-manrope text-[8px] text-[#8FA8A2]/60">
                      Device:{" "}
                      {reading.deviceId}
                    </p>
                  </div>

                  <Activity className="h-3.5 w-3.5 shrink-0 text-[#2DD4BF]/70" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/[0.025] px-3 py-2">
                    <p className="font-manrope text-[8px] uppercase tracking-[0.08em] text-[#8FA8A2]/60">
                      Heart rate
                    </p>

                    <p className="mt-1 font-manrope text-[10px] font-bold text-white/85">
                      {reading.heartRate} bpm
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/[0.025] px-3 py-2">
                    <p className="font-manrope text-[8px] uppercase tracking-[0.08em] text-[#8FA8A2]/60">
                      Temperature
                    </p>

                    <p className="mt-1 font-manrope text-[10px] font-bold text-white/85">
                      {reading.temperature} °F
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Alert history                                                              */
/* -------------------------------------------------------------------------- */

function AlertHistory({
  alerts,
}: {
  alerts: Array<{
    id: string;
    patientId: string;
    readingId: string;
    parameter: string;
    value: number;
    status: string;
    createdAt: string;
  }>;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0E2723]">
      <SectionHeader
        icon={
          <AlertTriangle className="h-4 w-4" />
        }
        title="Alert history"
        description="Alerts recorded for this patient."
      />

      {alerts.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center px-5 py-10">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-5 w-5 text-[#2DD4BF]/70" />

            <p className="mt-3 font-manrope text-[11px] font-semibold text-white/75">
              No alerts recorded
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.05]">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  alert.status === "ACTIVE"
                    ? "bg-red-400/[0.07] text-red-400"
                    : "bg-white/[0.035] text-[#8FA8A2]"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-manrope text-[10px] font-bold capitalize text-white/85">
                  {formatParameter(
                    alert.parameter
                  )}
                </p>

                <p className="mt-0.5 font-manrope text-[8px] text-[#8FA8A2]/65">
                  {formatValue(
                    alert.parameter,
                    alert.value
                  )}{" "}
                  ·{" "}
                  {formatDateTime(
                    alert.createdAt
                  )}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-md px-2 py-1 font-manrope text-[8px] font-bold uppercase tracking-[0.06em] ${
                  alert.status === "ACTIVE"
                    ? "bg-red-400/[0.07] text-red-300"
                    : "bg-white/[0.035] text-[#8FA8A2]"
                }`}
              >
                {alert.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section header                                                             */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2DD4BF]/[0.06] text-[#2DD4BF]">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="font-manrope text-[12px] font-bold text-white">
            {title}
          </h2>

          <p className="mt-0.5 font-manrope text-[9px] leading-relaxed text-[#8FA8A2]/65">
            {description}
          </p>
        </div>
      </div>

      {badge && (
        <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md bg-red-400/[0.07] px-1.5 font-manrope text-[9px] font-bold text-red-300">
          {badge}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Table heading                                                              */
/* -------------------------------------------------------------------------- */

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="font-manrope text-[8px] font-bold uppercase tracking-[0.12em] text-[#8FA8A2]/60">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams<{
    id: string;
  }>();

  const patientId = params?.id;

  /*
   * usePatient intentionally calls both:
   *
   * GET /patients/:id
   * GET /patients/:id/summary
   *
   * The basic patient endpoint provides the primary
   * patient record, while the summary endpoint provides
   * readings, alerts, latest reading and active alerts.
   */
  const {
    patient,
    summary,
    isLoading,
    isPatientLoading,
    isSummaryLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = usePatient(patientId);

  const fullName = useMemo(() => {
    if (!patient) return "Patient";

    return getFullName(
      patient.firstName,
      patient.lastName
    );
  }, [patient]);

  const initials = useMemo(() => {
    if (!patient) return "P";

    return getInitials(
      patient.firstName,
      patient.lastName
    );
  }, [patient]);

  const readings = summary?.readings ?? [];
  const alerts = summary?.alerts ?? [];
  const activeAlerts =
    summary?.activeAlerts ?? [];

  /*
   * The API gives us the latest reading directly.
   * We use that instead of calculating it from readings.
   */
  const latestReading =
    summary?.latestReading ?? null;

  const handleBack = () => {
    router.push("/dashboard/patients");
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <DashboardHeader
          userName="there"
          userType={undefined}
        />

        <div className="mb-5">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 font-manrope text-[10px] font-semibold text-[#8FA8A2] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to patients
          </button>
        </div>

        <PatientDetailSkeleton />
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="w-full">
        <DashboardHeader
          userName="there"
          userType={undefined}
        />

        <button
          type="button"
          onClick={handleBack}
          className="mb-5 inline-flex items-center gap-2 font-manrope text-[10px] font-semibold text-[#8FA8A2] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to patients
        </button>

        <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0E2723] px-5">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.06]">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>

            <h2 className="mt-4 font-manrope text-sm font-bold text-white">
              Unable to load patient
            </h2>

            <p className="mt-1.5 font-manrope text-[10px] leading-relaxed text-[#8FA8A2]">
              {error instanceof Error
                ? error.message
                : "The patient could not be retrieved. Please try again."}
            </p>

            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] px-4 font-manrope text-[10px] font-bold text-[#B8C9C4] transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-[10px] font-bold text-[#06201C] transition-colors hover:bg-[#5EEAD4]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <DashboardHeader
        userName="there"
        userType={undefined}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Breadcrumb / actions                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 font-manrope text-[10px] font-semibold text-[#8FA8A2] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to patients
        </button>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0E2723] px-3.5 font-manrope text-[10px] font-bold text-[#8FA8A2] transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isFetching
                ? "animate-spin"
                : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Patient profile                                                     */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0E2723]">
        <div className="relative overflow-hidden p-5 sm:p-6">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#2DD4BF]/[0.035] blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.08]">
                <span className="font-manrope text-lg font-extrabold text-[#2DD4BF]">
                  {initials}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate font-manrope text-xl font-extrabold tracking-tight text-white">
                    {fullName}
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.05] px-2 py-1 font-manrope text-[8px] font-bold uppercase tracking-[0.08em] text-[#2DD4BF]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
                    Patient
                  </span>
                </div>

                <p className="mt-1.5 font-manrope text-[9px] text-[#8FA8A2]/65">
                  Patient ID:{" "}
                  <span className="text-[#8FA8A2]">
                    {patient.id}
                  </span>
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <span className="inline-flex min-w-0 items-center gap-1.5 font-manrope text-[9px] text-[#8FA8A2]">
                    <Mail className="h-3 w-3 shrink-0 text-[#8FA8A2]/60" />
                    <span className="truncate">{patient.email}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-manrope text-[9px] text-[#8FA8A2]">
                    <Phone className="h-3 w-3 text-[#8FA8A2]/60" />
                    {patient.contact}
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-manrope text-[9px] text-[#8FA8A2]">
                    <CalendarDays className="h-3 w-3 text-[#8FA8A2]/60" />
                    Born{" "}
                    {formatDate(
                      patient.dateOfBirth
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.018] px-3.5 py-2.5 sm:flex">
              <CircleUserRound className="h-4 w-4 text-[#8FA8A2]/70" />

              <div>
                <p className="font-manrope text-[8px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]/55">
                  Profile status
                </p>

                <p className="mt-0.5 font-manrope text-[10px] font-bold text-white/80">
                  Active record
                </p>
              </div>
            </div>
          </div>

          {/* Patient details */}
          <div className="relative mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <PatientInfoItem
              icon={
                <UserRound className="h-3 w-3" />
              }
              label="Full name"
              value={fullName}
            />

            <PatientInfoItem
              icon={
                <Mail className="h-3 w-3" />
              }
              label="Email"
              value={patient.email}
            />

            <PatientInfoItem
              icon={
                <CalendarDays className="h-3 w-3" />
              }
              label="Date of birth"
              value={formatDate(
                patient.dateOfBirth
              )}
            />

            <PatientInfoItem
              icon={
                <CircleUserRound className="h-3 w-3" />
              }
              label="Gender"
              value={
                patient.gender || "—"
              }
            />

            <PatientInfoItem
              icon={
                <Phone className="h-3 w-3" />
              }
              label="Contact"
              value={patient.contact}
            />
          </div>
        </div>

        <div className="border-t border-white/[0.06] bg-white/[0.012] px-5 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5 font-manrope text-[8px] text-[#8FA8A2]/60">
              <CalendarDays className="h-3 w-3" />
              Registered{" "}
              {formatDate(
                patient.createdAt
              )}
            </span>

            <span className="inline-flex items-center gap-1.5 font-manrope text-[8px] text-[#8FA8A2]/60">
              <RefreshCw className="h-3 w-3" />
              Updated{" "}
              {formatDate(
                patient.updatedAt
              )}
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Monitoring metrics                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={
            <Activity className="h-4 w-4" />
          }
          label="Health readings"
          value={
            isSummaryLoading
              ? "..."
              : String(readings.length)
          }
          description="Recorded readings in patient summary"
          tone="teal"
        />

        <MetricCard
          icon={
            <AlertTriangle className="h-4 w-4" />
          }
          label="Active alerts"
          value={
            isSummaryLoading
              ? "..."
              : String(activeAlerts.length)
          }
          description={
            activeAlerts.length > 0
              ? "Requires clinical attention"
              : "No active alerts"
          }
          tone={
            activeAlerts.length > 0
              ? "danger"
              : "teal"
          }
        />

        <MetricCard
          icon={
            <Cpu className="h-4 w-4" />
          }
          label="Monitoring device"
          value={
            latestReading
              ? "Connected"
              : "—"
          }
          description={
            latestReading
              ? "Latest reading received"
              : "No device reading available"
          }
          tone="blue"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main monitoring content                                             */}
      {/* ------------------------------------------------------------------ */}

      {isSummaryLoading ? (
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="h-[390px] animate-pulse rounded-2xl bg-[#0E2723]" />
          <div className="h-[390px] animate-pulse rounded-2xl bg-[#0E2723]" />
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <LatestReadingCard
              reading={latestReading}
            />

            <ActiveAlertsCard
              alerts={activeAlerts}
            />
          </div>

          <div className="mt-5">
            <ReadingsHistory
              readings={readings}
            />
          </div>

          <div className="mt-5">
            <AlertHistory
              alerts={alerts}
            />
          </div>
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Footer information                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-[#0E2723]/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5 text-[#8FA8A2]/50" />

          <p className="font-manrope text-[8px] text-[#8FA8A2]/60">
            Monitoring data is retrieved directly from
            the Remote Care API.
          </p>
        </div>

        <p className="font-manrope text-[8px] text-[#8FA8A2]/45">
          Patient record
        </p>
      </div>
    </div>
  );
}
