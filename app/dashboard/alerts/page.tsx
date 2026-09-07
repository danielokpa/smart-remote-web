"use client";

import {
  AlertCircle,
  Activity,
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Filter,
  HeartPulse,
  RefreshCw,
  Search,
  ShieldAlert,
  Thermometer,
  UserRound,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, PageShell } from "@/components/PageShell";
import { useAlerts } from "@/lib/hooks/alerts/useAlerts";
import {
  ALERT_STATUS_OPTIONS,
  type AlertStatus,
} from "@/lib/types/alerts/alerts";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_LIMIT = 20;

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

function getPatientName(alert: {
  patient: {
    firstName: string;
    lastName: string;
  };
}): string {
  return `${alert.patient.firstName} ${alert.patient.lastName}`.trim();
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

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  description,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E2723] p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.025] blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8FA8A2]">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#647f78]">
            {description}
          </p>
        </div>

        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
            iconClassName,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading Skeleton                                                           */
/* -------------------------------------------------------------------------- */

function AlertsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-white/10 bg-[#0E2723] p-5"
          >
            <div className="flex gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.06]" />

              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-4 w-36 rounded bg-white/[0.06]" />
                <div className="h-3 w-52 rounded bg-white/[0.04]" />
                <div className="h-3 w-32 rounded bg-white/[0.04]" />
              </div>

              <div className="hidden h-7 w-20 rounded-full bg-white/[0.06] sm:block" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0E2723] px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
        <Bell className="h-7 w-7 text-[#2DD4BF]" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-white">
        {hasFilters
          ? "No alerts match your filters"
          : "No health alerts"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8FA8A2]">
        {hasFilters
          ? "Try changing your filters or clearing them to view all available alerts."
          : "There are currently no health alerts available in the monitoring system."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF]"
        >
          <XCircle className="h-4 w-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error State                                                                */
/* -------------------------------------------------------------------------- */

function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-400/20 bg-[#0E2723] p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
            <AlertCircle className="h-5 w-5 text-red-300" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Unable to load alerts
            </h3>

            <p className="mt-1 max-w-xl text-sm leading-6 text-[#8FA8A2]">
              {message ??
                "Something went wrong while retrieving health alerts."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-[#2DD4BF]/30 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF]"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Alert Row                                                                  */
/* -------------------------------------------------------------------------- */

function AlertRow({
  alert,
  onPatientClick,
  onReadingClick,
}: {
  alert: ReturnType<
    typeof useAlerts
  >["alerts"][number];
  onPatientClick: () => void;
  onReadingClick: () => void;
}) {
  const ParameterIcon = getParameterIcon(
    alert.parameter
  );

  const StatusIcon = getStatusIcon(
    alert.status
  );

  const isActive =
    alert.status === "ACTIVE";

  const unit = getParameterUnit(
    alert.parameter
  );

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl border bg-[#0E2723] transition-all",
        isActive
          ? "border-red-400/15 hover:border-red-400/30"
          : "border-white/[0.07] hover:border-[#2DD4BF]/20",
      ].join(" ")}
    >
      {isActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-red-400/70"
        />
      )}

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          {/* Alert identity */}

          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                isActive
                  ? "border-red-400/20 bg-red-400/10 text-red-300"
                  : "border-[#2DD4BF]/15 bg-[#2DD4BF]/10 text-[#2DD4BF]",
              ].join(" ")}
            >
              <ParameterIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-white">
                  {getParameterLabel(
                    alert.parameter
                  )}
                </h3>

                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                    getStatusClasses(
                      alert.status
                    ),
                  ].join(" ")}
                >
                  <StatusIcon className="h-3 w-3" />
                  {alert.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-[#8FA8A2]">
                Alert triggered for{" "}
                <button
                  type="button"
                  onClick={onPatientClick}
                  className="font-semibold text-white transition hover:text-[#2DD4BF]"
                >
                  {getPatientName(alert)}
                </button>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#647f78]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatRelativeTime(
                    alert.createdAt
                  )}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(
                    alert.createdAt
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Value */}

          <div className="flex items-center justify-between gap-6 border-t border-white/[0.06] pt-4 sm:justify-start lg:min-w-[150px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#647f78]">
                Recorded value
              </p>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span
                  className={[
                    "text-2xl font-bold tracking-tight",
                    isActive
                      ? "text-red-300"
                      : "text-white",
                  ].join(" ")}
                >
                  {alert.value}
                </span>

                {unit && (
                  <span className="text-xs font-medium text-[#8FA8A2]">
                    {unit}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right lg:hidden">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#647f78]">
                Reading
              </p>

              <button
                type="button"
                onClick={onReadingClick}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#2DD4BF] hover:underline"
              >
                View
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Patient */}

          <div className="hidden min-w-[190px] border-l border-white/[0.06] pl-6 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#647f78]">
              Patient
            </p>

            <button
              type="button"
              onClick={onPatientClick}
              className="mt-2 flex min-w-0 items-center gap-2 text-left"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                <UserRound className="h-4 w-4 text-[#8FA8A2]" />
              </div>

              <span className="truncate text-sm font-semibold text-white transition group-hover:text-[#2DD4BF]">
                {getPatientName(alert)}
              </span>
            </button>
          </div>

          {/* Reading */}

          <div className="hidden min-w-[130px] border-l border-white/[0.06] pl-6 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#647f78]">
              Reading
            </p>

            <button
              type="button"
              onClick={onReadingClick}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2DD4BF] transition hover:text-white"
            >
              View reading
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile metadata */}

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-3 lg:hidden">
          <div className="rounded-xl bg-white/[0.025] p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#647f78]">
              Patient
            </p>

            <button
              type="button"
              onClick={onPatientClick}
              className="mt-1 block max-w-full truncate text-xs font-semibold text-white hover:text-[#2DD4BF]"
            >
              {getPatientName(alert)}
            </button>
          </div>

          <div className="rounded-xl bg-white/[0.025] p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#647f78]">
              Reading
            </p>

            <button
              type="button"
              onClick={onReadingClick}
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#2DD4BF]"
            >
              Open
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="col-span-2 rounded-xl bg-white/[0.025] p-3 sm:col-span-1">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#647f78]">
              Reading captured
            </p>

            <p className="mt-1 truncate text-xs font-medium text-[#8FA8A2]">
              {formatDate(
                alert.reading.recordedAt
              )}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AlertsPage() {
  const [status, setStatus] =
    useState<AlertStatus | undefined>(
      undefined
    );

  const [patientId, setPatientId] =
    useState("");

  const [patientFilter, setPatientFilter] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const {
    alerts,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isError,
    error,
  } = useAlerts({
    status,
    patientId:
      patientId.trim() || undefined,
    limit: DEFAULT_LIMIT,
  });

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const statistics = useMemo(() => {
    const active = alerts.filter(
      (alert) => alert.status === "ACTIVE"
    ).length;

    const resolved = alerts.filter(
      (alert) => alert.status === "RESOLVED"
    ).length;

    const dismissed = alerts.filter(
      (alert) => alert.status === "DISMISSED"
    ).length;

    const patients = new Set(
      alerts.map(
        (alert) => alert.patientId
      )
    ).size;

    return {
      total: alerts.length,
      active,
      resolved,
      dismissed,
      patients,
    };
  }, [alerts]);

  /* ------------------------------------------------------------------------ */
  /* Filters                                                                  */
  /* ------------------------------------------------------------------------ */

  const hasFilters =
    Boolean(status) ||
    Boolean(patientId.trim());

  function applyPatientFilter() {
    setPatientId(patientFilter.trim());
  }

  function clearFilters() {
    setStatus(undefined);
    setPatientId("");
    setPatientFilter("");
  }

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  function goToPatient(patientId: string) {
    window.location.href = `/dashboard/patients/${patientId}`;
  }

  function goToReading(readingId: string) {
    window.location.href = `/dashboard/readings/${readingId}`;
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <PageShell>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <PageHero
        eyebrow="Health Monitoring"
        title="Health Alerts"
        description="Monitor clinically significant readings and keep track of alerts generated across the Remote Care system."
        icon={
          <Bell className="h-5 w-5 text-[#2DD4BF]" />
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
      {/* Statistics                                                         */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading && !isError && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Alerts"
            value={statistics.total}
            description="Loaded alert records"
            icon={
              <Bell className="h-5 w-5 text-[#2DD4BF]" />
            }
            iconClassName="border-[#2DD4BF]/15 bg-[#2DD4BF]/10"
          />

          <StatCard
            label="Active"
            value={statistics.active}
            description="Require attention"
            icon={
              <ShieldAlert className="h-5 w-5 text-red-300" />
            }
            iconClassName="border-red-400/20 bg-red-400/10"
          />

          <StatCard
            label="Resolved"
            value={statistics.resolved}
            description="Previously addressed"
            icon={
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            }
            iconClassName="border-emerald-400/20 bg-emerald-400/10"
          />

          <StatCard
            label="Patients"
            value={statistics.patients}
            description="Patients represented"
            icon={
              <UserRound className="h-5 w-5 text-sky-300" />
            }
            iconClassName="border-sky-400/20 bg-sky-400/10"
          />
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Filter toolbar                                                     */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-6 rounded-3xl border border-white/10 bg-[#0E2723] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Filter className="h-4 w-4 text-[#8FA8A2]" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                Alert filters
              </h2>

              <p className="mt-0.5 text-xs text-[#647f78]">
                Narrow alerts by status or patient.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (current) => !current
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-[#8FA8A2] transition hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] lg:hidden"
          >
            <Filter className="h-3.5 w-3.5" />
            {showFilters
              ? "Hide filters"
              : "Show filters"}
            <ChevronDown
              className={[
                "h-3.5 w-3.5 transition-transform",
                showFilters
                  ? "rotate-180"
                  : "",
              ].join(" ")}
            />
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#8FA8A2] transition hover:bg-white/[0.04] hover:text-white"
              >
                <XCircle className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div
          className={[
            "mt-5 grid gap-4 border-t border-white/[0.06] pt-5",
            showFilters
              ? "grid"
              : "hidden lg:grid",
            "lg:grid-cols-[minmax(0,1fr)_220px_auto]",
          ].join(" ")}
        >
          {/* Patient ID */}

          <div>
            <label
              htmlFor="patient-id"
              className="mb-2 block text-xs font-semibold text-[#8FA8A2]"
            >
              Patient ID
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#647f78]" />

              <input
                id="patient-id"
                type="text"
                value={patientFilter}
                onChange={(event) =>
                  setPatientFilter(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    applyPatientFilter();
                  }
                }}
                placeholder="Enter patient UUID"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#4f6963] transition focus:border-[#2DD4BF]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#2DD4BF]/10"
              />
            </div>
          </div>

          {/* Status */}

          <div>
            <label
              htmlFor="alert-status"
              className="mb-2 block text-xs font-semibold text-[#8FA8A2]"
            >
              Status
            </label>

            <div className="relative">
              <select
                id="alert-status"
                value={status ?? ""}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as
                      | AlertStatus
                      | undefined
                  )
                }
                className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.03] px-3 pr-9 text-sm text-white outline-none transition focus:border-[#2DD4BF]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#2DD4BF]/10"
              >
                <option
                  value=""
                  className="bg-[#0E2723]"
                >
                  All statuses
                </option>

                {ALERT_STATUS_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-[#0E2723]"
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#647f78]" />
            </div>
          </div>

          {/* Apply */}

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={applyPatientFilter}
              className="h-10 flex-1 rounded-xl bg-[#2DD4BF] px-4 text-sm font-bold text-[#06201c] transition hover:bg-[#5eead4] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30 lg:flex-none"
            >
              Apply filters
            </button>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="hidden h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-[#8FA8A2] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Active alert banner                                                */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading &&
        !isError &&
        statistics.active > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.045] p-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />

            <div>
              <p className="text-sm font-semibold text-white">
                {statistics.active} active{" "}
                {statistics.active === 1
                  ? "alert requires"
                  : "alerts require"}{" "}
                attention
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8FA8A2]">
                Review the affected patient and
                associated reading to determine the
                appropriate clinical response.
              </p>
            </div>
          </div>
        )}

      {/* ------------------------------------------------------------------ */}
      {/* Alert list                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Alert activity
            </h2>

            <p className="mt-1 text-xs text-[#647f78]">
              {alerts.length === 0
                ? "No alert records loaded."
                : `${alerts.length} alert${
                    alerts.length === 1
                      ? ""
                      : "s"
                  } currently loaded`}
            </p>
          </div>

          {isFetching &&
            !isFetchingNextPage && (
              <div className="inline-flex items-center gap-2 text-xs text-[#8FA8A2]">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Updating alerts...
              </div>
            )}
        </div>

        {isLoading ? (
          <AlertsSkeleton />
        ) : isError ? (
          <ErrorState
            message={error?.message}
            onRetry={() => refetch()}
          />
        ) : alerts.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            onClear={clearFilters}
          />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                onPatientClick={() =>
                  goToPatient(
                    alert.patient.id
                  )
                }
                onReadingClick={() =>
                  goToReading(
                    alert.reading.id
                  )
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Pagination                                                         */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading &&
        !isError &&
        alerts.length > 0 && (
          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0E2723] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-[#8FA8A2]">
              <Activity className="h-3.5 w-3.5" />

              <span>
                {hasNextPage
                  ? "More alerts are available."
                  : "You have reached the end of the alert list."}
              </span>
            </div>

            {hasNextPage && (
              <button
                type="button"
                onClick={() =>
                  fetchNextPage()
                }
                disabled={isFetchingNextPage}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 px-4 text-sm font-semibold text-[#2DD4BF] transition hover:bg-[#2DD4BF]/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load more alerts
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </section>
        )}

      {/* ------------------------------------------------------------------ */}
      {/* Monitoring note                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.035] p-4">
        <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4BF]" />

        <p className="text-xs leading-5 text-[#8FA8A2]">
          Alerts are generated from health readings
          processed by Remote Care. Use the associated
          patient and reading records to review the
          underlying measurement and monitoring context.
        </p>
      </div>
    </PageShell>
  );
}