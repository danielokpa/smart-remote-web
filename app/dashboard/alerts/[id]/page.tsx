"use client";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Info,
  Mail,
  Phone,
  RefreshCw,
  ShieldAlert,
  Thermometer,
  UserRound,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { PageHero, PageShell } from "@/components/PageShell";
import { useAlert } from "@/lib/hooks/alerts/useAlerts";
import type { AlertStatus } from "@/lib/types/alerts/alerts";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(
  value: string | undefined | null
): string {
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

function formatRelativeTime(
  value: string | undefined | null
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const difference = Date.now() - date.getTime();

  if (difference < 0) {
    return "Scheduled";
  }

  const seconds = Math.floor(
    difference / 1000
  );

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
}

function getParameterLabel(
  parameter: string
): string {
  switch (parameter.toLowerCase()) {
    case "heart_rate":
      return "Heart Rate";

    case "temperature":
      return "Temperature";

    default:
      return parameter
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (character) =>
          character.toUpperCase()
        );
  }
}

function getParameterUnit(
  parameter: string
): string {
  switch (parameter.toLowerCase()) {
    case "heart_rate":
      return "bpm";

    default:
      return "";
  }
}

function getParameterIcon(
  parameter: string
) {
  switch (parameter.toLowerCase()) {
    case "heart_rate":
      return HeartPulse;

    case "temperature":
      return Thermometer;

    default:
      return Activity;
  }
}

function getStatusLabel(
  status: AlertStatus
): string {
  switch (status) {
    case "ACTIVE":
      return "Active";

    case "RESOLVED":
      return "Resolved";

    case "DISMISSED":
      return "Dismissed";

    default:
      return status;
  }
}

function getStatusClasses(
  status: AlertStatus
): string {
  switch (status) {
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

function getStatusIcon(
  status: AlertStatus
) {
  switch (status) {
    case "ACTIVE":
      return ShieldAlert;

    case "RESOLVED":
      return CheckCircle2;

    case "DISMISSED":
      return XCircle;

    default:
      return AlertCircle;
  }
}

function getPatientName(
  patient:
    | {
        firstName: string;
        lastName: string;
      }
    | null
    | undefined
): string {
  if (!patient) {
    return "Unknown patient";
  }

  return `${patient.firstName} ${patient.lastName}`.trim();
}

/* -------------------------------------------------------------------------- */
/* Detail row                                                                 */
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

        <span className="text-sm text-[#8FA8A2]">
          {label}
        </span>
      </div>

      <div className="min-w-0 text-right text-sm font-medium text-white">
        {value}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function AlertDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-40 rounded-3xl border border-white/10 bg-[#0E2723]" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-3xl border border-white/10 bg-[#0E2723] lg:col-span-2" />
        <div className="h-80 rounded-3xl border border-white/10 bg-[#0E2723]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-3xl border border-white/10 bg-[#0E2723]" />
        <div className="h-96 rounded-3xl border border-white/10 bg-[#0E2723]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

function AlertDetailError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-400/20 bg-[#0E2723] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
            <AlertCircle className="h-6 w-6 text-red-300" />
          </div>

          <div>
            <h2 className="font-bold text-white">
              Unable to load alert
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-[#8FA8A2]">
              {message ??
                "We could not retrieve this alert. It may no longer exist or may be temporarily unavailable."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AlertDetailPage() {
  const params = useParams();
  const router = useRouter();

  const alertId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : undefined;

  const {
    alert,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAlert(alertId);

  const patientName = useMemo(
    () =>
      getPatientName(
        alert?.patient
      ),
    [alert?.patient]
  );

  if (isLoading) {
    return (
      <PageShell>
        <AlertDetailSkeleton />
      </PageShell>
    );
  }

  if (isError || !alert) {
    return (
      <PageShell>
        <PageHero
          eyebrow="Health Monitoring"
          title="Alert unavailable"
          description="The requested alert could not be retrieved."
          backHref="/dashboard/alerts"
          icon={
            <BellIcon />
          }
        />

        <div className="mt-6">
          <AlertDetailError
            message={error?.message}
            onRetry={() => refetch()}
          />
        </div>
      </PageShell>
    );
  }

  const ParameterIcon =
    getParameterIcon(
      alert.parameter
    );

  const StatusIcon =
    getStatusIcon(alert.status);

  const parameterLabel =
    getParameterLabel(
      alert.parameter
    );

  const parameterUnit =
    getParameterUnit(
      alert.parameter
    );

  const isActive =
    alert.status === "ACTIVE";

  return (
    <PageShell>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <PageHero
        eyebrow="Health Alert"
        title={`${parameterLabel} Alert`}
        description={`Alert generated for ${patientName} from a recorded health measurement.`}
        backHref="/dashboard/alerts"
        icon={
          <ParameterIcon className="h-5 w-5 text-[#2DD4BF]" />
        }
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
                isFetching
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />
            Refresh
          </button>
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Alert status / primary value                                       */}
      {/* ------------------------------------------------------------------ */}

      <section
        className={[
          "relative mt-6 overflow-hidden rounded-3xl border bg-[#0E2723]",
          isActive
            ? "border-red-400/20"
            : "border-white/10",
        ].join(" ")}
      >
        {isActive && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-red-400/[0.06] blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -bottom-32 h-64 w-64 rounded-full bg-red-400/[0.025] blur-3xl"
            />
          </>
        )}

        <div className="relative p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}

            <div className="flex items-start gap-4">
              <div
                className={[
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
                  isActive
                    ? "border-red-400/20 bg-red-400/10"
                    : "border-[#2DD4BF]/15 bg-[#2DD4BF]/10",
                ].join(" ")}
              >
                <ParameterIcon
                  className={[
                    "h-6 w-6",
                    isActive
                      ? "text-red-300"
                      : "text-[#2DD4BF]",
                  ].join(" ")}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA8A2]">
                    Alert status
                  </p>

                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                      getStatusClasses(
                        alert.status
                      ),
                    ].join(" ")}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {getStatusLabel(
                      alert.status
                    )}
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {parameterLabel} measurement alert
                </h2>

                <p className="mt-1 text-sm text-[#8FA8A2]">
                  Generated{" "}
                  {formatRelativeTime(
                    alert.createdAt
                  )}
                </p>
              </div>
            </div>

            {/* Value */}

            <div className="rounded-2xl border border-white/[0.07] bg-black/10 px-6 py-5 lg:min-w-[230px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#647f78]">
                Triggered value
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span
                  className={[
                    "text-4xl font-bold tracking-tight",
                    isActive
                      ? "text-red-300"
                      : "text-white",
                  ].join(" ")}
                >
                  {alert.value}
                </span>

                {parameterUnit && (
                  <span className="text-sm font-medium text-[#8FA8A2]">
                    {parameterUnit}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-[#647f78]">
                Recorded measurement
              </p>
            </div>
          </div>

          {/* Timeline */}

          <div className="mt-7 grid gap-3 border-t border-white/[0.06] pt-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                <Clock3 className="h-4 w-4 text-[#8FA8A2]" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#647f78]">
                  Alert created
                </p>

                <p className="mt-0.5 text-sm font-medium text-white">
                  {formatDate(
                    alert.createdAt
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                <CalendarDays className="h-4 w-4 text-[#8FA8A2]" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#647f78]">
                  Reading recorded
                </p>

                <p className="mt-0.5 text-sm font-medium text-white">
                  {formatDate(
                    alert.reading.recordedAt
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Patient + Reading                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Patient */}

        <section className="rounded-3xl border border-white/10 bg-[#0E2723]">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
                <UserRound className="h-5 w-5 text-[#2DD4BF]" />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Affected Patient
                </h2>

                <p className="mt-0.5 text-xs text-[#8FA8A2]">
                  Patient associated with this alert
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/patients/${alert.patient.id}`
                )
              }
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2DD4BF] transition hover:bg-[#2DD4BF]/10 sm:inline-flex"
            >
              View patient
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {/* Patient identity */}

            <div className="mb-5 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2DD4BF]/10">
                <UserRound className="h-5 w-5 text-[#2DD4BF]" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-bold text-white">
                  {patientName}
                </p>

                <p
                  title={alert.patient.id}
                  className="mt-0.5 truncate font-mono text-[11px] text-[#647f78]"
                >
                  {alert.patient.id}
                </p>
              </div>
            </div>

            <DetailRow
              label="Email"
              value={
                <span className="max-w-[190px] truncate">
                  {alert.patient.email}
                </span>
              }
              icon={
                <Mail className="h-4 w-4" />
              }
            />

            <DetailRow
              label="Contact"
              value={alert.patient.contact}
              icon={
                <Phone className="h-4 w-4" />
              }
            />

            <DetailRow
              label="Date of birth"
              value={formatDate(
                alert.patient.dateOfBirth
              )}
              icon={
                <CalendarDays className="h-4 w-4" />
              }
            />

            <DetailRow
              label="Gender"
              value={alert.patient.gender}
              icon={
                <UserRound className="h-4 w-4" />
              }
            />

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/patients/${alert.patient.id}`
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] sm:hidden"
            >
              View patient profile
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* Underlying reading */}

        <section className="rounded-3xl border border-white/10 bg-[#0E2723]">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
                <Activity className="h-5 w-5 text-[#2DD4BF]" />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Underlying Reading
                </h2>

                <p className="mt-0.5 text-xs text-[#8FA8A2]">
                  Measurement that generated this alert
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/readings/${alert.reading.id}`
                )
              }
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2DD4BF] transition hover:bg-[#2DD4BF]/10 sm:inline-flex"
            >
              View reading
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            {/* Reading metrics */}

            <div className="grid grid-cols-2 gap-3">
              <div
                className={[
                  "rounded-2xl border p-4",
                  alert.parameter ===
                  "heart_rate"
                    ? "border-red-400/15 bg-red-400/[0.045]"
                    : "border-white/[0.06] bg-white/[0.025]",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <HeartPulse
                    className={[
                      "h-4 w-4",
                      alert.parameter ===
                      "heart_rate"
                        ? "text-red-300"
                        : "text-[#8FA8A2]",
                    ].join(" ")}
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#647f78]">
                    Heart rate
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold text-white">
                  {alert.reading.heartRate}
                  <span className="ml-1 text-xs font-medium text-[#8FA8A2]">
                    bpm
                  </span>
                </p>
              </div>

              <div
                className={[
                  "rounded-2xl border p-4",
                  alert.parameter ===
                  "temperature"
                    ? "border-red-400/15 bg-red-400/[0.045]"
                    : "border-white/[0.06] bg-white/[0.025]",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <Thermometer
                    className={[
                      "h-4 w-4",
                      alert.parameter ===
                      "temperature"
                        ? "text-red-300"
                        : "text-[#8FA8A2]",
                    ].join(" ")}
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#647f78]">
                    Temperature
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold text-white">
                  {alert.reading.temperature}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <DetailRow
                label="Recorded at"
                value={formatDate(
                  alert.reading.recordedAt
                )}
                icon={
                  <Clock3 className="h-4 w-4" />
                }
              />

              <DetailRow
                label="Reading ID"
                value={
                  <span
                    title={alert.reading.id}
                    className="block max-w-[180px] truncate font-mono text-[11px] text-[#8FA8A2]"
                  >
                    {alert.reading.id}
                  </span>
                }
              />

              <DetailRow
                label="Patient ID"
                value={
                  <span
                    title={
                      alert.reading.patientId
                    }
                    className="block max-w-[180px] truncate font-mono text-[11px] text-[#8FA8A2]"
                  >
                    {alert.reading.patientId}
                  </span>
                }
              />

              <DetailRow
                label="Device ID"
                value={
                  <span
                    title={
                      alert.reading.deviceId
                    }
                    className="block max-w-[180px] truncate font-mono text-[11px] text-[#8FA8A2]"
                  >
                    {alert.reading.deviceId}
                  </span>
                }
              />
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/readings/${alert.reading.id}`
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] sm:hidden"
            >
              View full reading
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Clinical context                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723]">
        <div className="border-b border-white/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
              <Info className="h-5 w-5 text-[#2DD4BF]" />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Alert Context
              </h2>

              <p className="mt-0.5 text-xs text-[#8FA8A2]">
                Summary of why this record appears in the alert system
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#647f78]">
              Parameter
            </p>

            <div className="mt-3 flex items-center gap-2">
              <ParameterIcon className="h-4 w-4 text-[#2DD4BF]" />

              <span className="text-sm font-semibold text-white">
                {parameterLabel}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#647f78]">
              Alert value
            </p>

            <p className="mt-3 text-sm font-semibold text-white">
              {alert.value}
              {parameterUnit && (
                <span className="ml-1 text-xs font-medium text-[#8FA8A2]">
                  {parameterUnit}
                </span>
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#647f78]">
              Current status
            </p>

            <span
              className={[
                "mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                getStatusClasses(
                  alert.status
                ),
              ].join(" ")}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {getStatusLabel(
                alert.status
              )}
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Technical information                                               */}
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
              Technical identifiers associated with this alert
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#647f78]">
              Alert ID
            </p>

            <p
              title={alert.id}
              className="mt-2 truncate font-mono text-[11px] text-[#8FA8A2]"
            >
              {alert.id}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#647f78]">
              Patient ID
            </p>

            <p
              title={alert.patientId}
              className="mt-2 truncate font-mono text-[11px] text-[#8FA8A2]"
            >
              {alert.patientId}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#647f78]">
              Reading ID
            </p>

            <p
              title={alert.readingId}
              className="mt-2 truncate font-mono text-[11px] text-[#8FA8A2]"
            >
              {alert.readingId}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Monitoring note                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.035] p-4">
        <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]" />

        <p className="text-xs leading-5 text-[#8FA8A2]">
          This is a read-only monitoring view. The alert,
          patient information, and underlying reading are
          displayed directly from the Remote Care monitoring
          system.
        </p>
      </div>
    </PageShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Small fallback icon                                                        */
/* -------------------------------------------------------------------------- */

function BellIcon() {
  return (
    <ShieldAlert className="h-5 w-5 text-[#2DD4BF]" />
  );
}