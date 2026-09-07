"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  HeartPulse,
  Loader2,
  RefreshCw,
  Search,
  Thermometer,
  UserRound,
  X,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, PageShell } from "@/components/PageShell";
import { useReadings } from "@/lib/hooks/readings/use-readings";
import type {
  ReadingListItem,
} from "@/lib/types/readings/readings";

const PAGE_SIZE = 20;

const SEARCH_DEBOUNCE_MS = 400;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatRelativeTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(value);
}

function getPatientName(reading: ReadingListItem) {
  return `${reading.patient.firstName} ${reading.patient.lastName}`;
}

function getAlertCount(reading: ReadingListItem) {
  return reading.alerts?.filter(
    (alert) => alert.status === "ACTIVE"
  ).length ?? 0;
}

function hasActiveAlert(reading: ReadingListItem) {
  return getAlertCount(reading) > 0;
}

function getHeartRateStatus(
  value: number
): "normal" | "warning" | "critical" {
  if (value < 50 || value > 120) {
    return "critical";
  }

  if (value < 60 || value > 100) {
    return "warning";
  }

  return "normal";
}

function getTemperatureStatus(
  value: number
): "normal" | "warning" | "critical" {
  if (value < 35 || value >= 39) {
    return "critical";
  }

  if (value < 36 || value >= 37.5) {
    return "warning";
  }

  return "normal";
}

function statusLabel(
  status: "normal" | "warning" | "critical"
) {
  switch (status) {
    case "critical":
      return "Critical";

    case "warning":
      return "Monitor";

    default:
      return "Normal";
  }
}

/* -------------------------------------------------------------------------- */
/* Small reusable UI pieces                                                   */
/* -------------------------------------------------------------------------- */

interface MetricCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0E2723] p-5 transition-colors hover:border-[#2DD4BF]/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#2DD4BF]/5 blur-2xl transition-opacity group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8FA8A2]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#8FA8A2]/70">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/10">
          <Icon className="h-4.5 w-4.5 text-[#2DD4BF]" />
        </div>
      </div>
    </div>
  );
}

function ReadingStatusBadge({
  status,
}: {
  status: "normal" | "warning" | "critical";
}) {
  const config = {
    normal: {
      label: "Normal",
      className:
        "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
      icon: CheckCircle2,
    },
    warning: {
      label: "Monitor",
      className:
        "border-amber-400/15 bg-amber-400/10 text-amber-300",
      icon: AlertTriangle,
    },
    critical: {
      label: "Critical",
      className:
        "border-red-400/15 bg-red-400/10 text-red-300",
      icon: AlertTriangle,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full",
        "border px-2.5 py-1",
        "text-[10px] font-bold",
        config.className,
      ].join(" ")}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function DeviceStatusBadge({
  status,
}: {
  status: "ACTIVE" | "INACTIVE";
}) {
  const active = status === "ACTIVE";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border",
        "px-2 py-1 text-[9px] font-bold uppercase tracking-wide",
        active
          ? "border-[#2DD4BF]/15 bg-[#2DD4BF]/10 text-[#2DD4BF]"
          : "border-white/10 bg-white/[0.04] text-[#8FA8A2]",
      ].join(" ")}
    >
      {active ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}

      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

function ReadingSkeleton() {
  return (
    <div className="animate-pulse border-b border-white/[0.06] px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-white/[0.06]" />

        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-white/[0.06]" />
          <div className="h-2.5 w-24 rounded bg-white/[0.04]" />
        </div>

        <div className="hidden h-3 w-16 rounded bg-white/[0.06] sm:block" />
        <div className="hidden h-3 w-16 rounded bg-white/[0.06] md:block" />
        <div className="h-3 w-20 rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="divide-y divide-white/[0.06]">
      {Array.from({ length: 6 }).map((_, index) => (
        <ReadingSkeleton key={index} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/5">
        <Activity className="h-6 w-6 text-[#2DD4BF]" />
      </div>

      <h3 className="mt-5 text-sm font-bold text-white">
        {hasFilters
          ? "No matching readings"
          : "No health readings yet"}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-[#8FA8A2]/70">
        {hasFilters
          ? "Try adjusting your search or patient filter to find the readings you are looking for."
          : "Health readings submitted through connected monitoring devices will appear here."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-[#8FA8A2] transition hover:border-[#2DD4BF]/20 hover:text-[#2DD4BF]"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error state                                                                */
/* -------------------------------------------------------------------------- */

function ErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/5">
        <AlertTriangle className="h-6 w-6 text-red-300" />
      </div>

      <h3 className="mt-5 text-sm font-bold text-white">
        Unable to load readings
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-[#8FA8A2]/70">
        Something went wrong while retrieving health readings.
        Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10 px-4 py-2.5 text-xs font-bold text-[#2DD4BF] transition hover:bg-[#2DD4BF]/15"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reading row                                                                */
/* -------------------------------------------------------------------------- */

function ReadingRow({
  reading,
}: {
  reading: ReadingListItem;
}) {
  const heartRateStatus = getHeartRateStatus(
    reading.heartRate
  );

  const temperatureStatus = getTemperatureStatus(
    reading.temperature
  );

  const activeAlerts = getAlertCount(reading);

  return (
    <div className="group border-b border-white/[0.06] px-5 py-4 transition-colors hover:bg-white/[0.015]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(190px,1.3fr)_150px_150px_minmax(160px,1fr)_110px] lg:items-center lg:gap-5">
        {/* Patient */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035]">
            <UserRound className="h-4 w-4 text-[#8FA8A2]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">
              {getPatientName(reading)}
            </p>

            <p className="mt-1 truncate text-[10px] text-[#8FA8A2]/65">
              ID: {reading.patientId.slice(0, 8)}...
            </p>
          </div>
        </div>

        {/* Vital readings */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-400/10">
            <HeartPulse className="h-3.5 w-3.5 text-rose-300" />
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-white">
                {reading.heartRate}
              </span>

              <span className="text-[9px] text-[#8FA8A2]">
                bpm
              </span>
            </div>

            <p className="text-[9px] text-[#8FA8A2]/60">
              Heart rate
            </p>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10">
            <Thermometer className="h-3.5 w-3.5 text-sky-300" />
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-white">
                {reading.temperature}
              </span>

              <span className="text-[9px] text-[#8FA8A2]">
                °C
              </span>
            </div>

            <p className="text-[9px] text-[#8FA8A2]/60">
              Temperature
            </p>
          </div>
        </div>

        {/* Device + status */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[#D9E7E3]">
              {reading.device.deviceName}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <DeviceStatusBadge
                status={reading.device.status}
              />

              {activeAlerts > 0 && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-300">
                  <AlertTriangle className="h-3 w-3" />
                  {activeAlerts} alert
                  {activeAlerts !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Time/status */}
        <div className="flex items-center justify-between gap-3 lg:block lg:text-right">
          <div className="lg:flex lg:justify-end">
            <ReadingStatusBadge
              status={
                hasActiveAlert(reading)
                  ? "critical"
                  : heartRateStatus === "critical" ||
                      temperatureStatus === "critical"
                    ? "critical"
                    : heartRateStatus === "warning" ||
                        temperatureStatus === "warning"
                      ? "warning"
                      : "normal"
              }
            />
          </div>

          <div className="mt-1 flex items-center gap-1 text-[9px] text-[#8FA8A2]/55 lg:justify-end">
            <Clock3 className="h-2.5 w-2.5" />
            {formatRelativeTime(reading.recordedAt)}
          </div>
        </div>
      </div>

      {/* Mobile metadata */}
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3 lg:hidden">
        <span className="text-[9px] text-[#8FA8A2]/55">
          Recorded {formatDate(reading.recordedAt)}
        </span>

        <span className="text-[9px] text-[#8FA8A2]/55">
          Device: {reading.device.deviceName}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function HealthReadingsPage() {
  const [search, setSearch] = useState("");
  const [patientId, setPatientId] = useState("");
  const [showPatientFilter, setShowPatientFilter] =
    useState(false);

  const {
    readings,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isError,
  } = useReadings({
    patientId: patientId || undefined,
    search: search.trim() || undefined,
    limit: PAGE_SIZE,
  });

  /* ---------------------------------------------------------------------- */
  /* Derived statistics                                                     */
  /* ---------------------------------------------------------------------- */

  const statistics = useMemo(() => {
    const total = readings.length;

    const activeAlerts = readings.reduce(
      (count, reading) =>
        count + getAlertCount(reading),
      0
    );

    const uniquePatients = new Set(
      readings.map((reading) => reading.patientId)
    ).size;

    const uniqueDevices = new Set(
      readings.map((reading) => reading.deviceId)
    ).size;

    return {
      total,
      activeAlerts,
      uniquePatients,
      uniqueDevices,
    };
  }, [readings]);

  const hasFilters =
    Boolean(search.trim()) ||
    Boolean(patientId);

  function clearFilters() {
    setSearch("");
    setPatientId("");
    setShowPatientFilter(false);
  }

  return (
    <PageShell>
      <div className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                              */}
        {/* ---------------------------------------------------------------- */}

        <PageHero
          eyebrow="Clinical Monitoring"
          title="Health Readings"
          description="Review real-time and historical health readings collected from connected patient monitoring devices."
          icon={
            <Activity className="h-5 w-5 text-[#2DD4BF]" />
          }
          actions={
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-xs font-bold text-[#D9E7E3] transition hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/5 hover:text-[#2DD4BF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={[
                  "h-3.5 w-3.5",
                  isFetching
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />

              Refresh
            </button>
          }
        />

        {/* ---------------------------------------------------------------- */}
        {/* Statistics                                                        */}
        {/* ---------------------------------------------------------------- */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            label="Readings loaded"
            value={statistics.total}
            description="Records in current view"
            icon={Activity}
          />

          <MetricCard
            label="Patients"
            value={statistics.uniquePatients}
            description="Patients represented"
            icon={UserRound}
          />

          <MetricCard
            label="Devices"
            value={statistics.uniqueDevices}
            description="Monitoring devices"
            icon={Database}
          />

          <MetricCard
            label="Active alerts"
            value={statistics.activeAlerts}
            description="Alerts in current view"
            icon={AlertTriangle}
          />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Main readings card                                                */}
        {/* ---------------------------------------------------------------- */}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E2723]">
          {/* Toolbar */}
          <div className="border-b border-white/[0.06] p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative min-w-0 flex-1 lg:max-w-xl">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA8A2]/50" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by heart rate or temperature..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#071A17] pl-10 pr-10 text-xs text-white outline-none placeholder:text-[#8FA8A2]/40 transition focus:border-[#2DD4BF]/30 focus:ring-2 focus:ring-[#2DD4BF]/5"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-[#8FA8A2]/60 transition hover:bg-white/5 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Patient filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPatientFilter(
                        (current) => !current
                      )
                    }
                    className={[
                      "inline-flex h-11 items-center gap-2 rounded-xl",
                      "border px-3.5 text-xs font-bold transition",
                      patientId
                        ? "border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]"
                        : "border-white/10 bg-[#071A17] text-[#8FA8A2] hover:border-white/15 hover:text-white",
                    ].join(" ")}
                  >
                    <UserRound className="h-3.5 w-3.5" />

                    Patient

                    <ChevronDown
                      className={[
                        "h-3.5 w-3.5 transition-transform",
                        showPatientFilter
                          ? "rotate-180"
                          : "",
                      ].join(" ")}
                    />
                  </button>

                  {showPatientFilter && (
                    <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-white/10 bg-[#0B211D] p-3 shadow-2xl shadow-black/30">
                      <p className="px-1 pb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8FA8A2]/60">
                        Patient ID
                      </p>

                      <input
                        value={patientId}
                        onChange={(event) =>
                          setPatientId(
                            event.target.value
                          )
                        }
                        placeholder="Enter patient UUID"
                        className="h-10 w-full rounded-lg border border-white/10 bg-[#071A17] px-3 text-[11px] text-white outline-none placeholder:text-[#8FA8A2]/35 focus:border-[#2DD4BF]/30"
                      />

                      <div className="mt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setPatientId("")
                          }
                          className="px-2 py-1.5 text-[10px] font-semibold text-[#8FA8A2] transition hover:text-white"
                        >
                          Clear
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setShowPatientFilter(false)
                          }
                          className="rounded-lg bg-[#2DD4BF]/10 px-3 py-1.5 text-[10px] font-bold text-[#2DD4BF] transition hover:bg-[#2DD4BF]/15"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="hidden h-11 items-center gap-1.5 rounded-xl border border-white/10 bg-[#071A17] px-3 text-xs font-bold text-[#8FA8A2] transition hover:text-white sm:inline-flex"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Search/filter context */}
            {hasFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-[#8FA8A2]/55">
                  Active filters:
                </span>

                {search.trim() && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold text-[#D9E7E3]">
                    Search: {search.trim()}
                  </span>
                )}

                {patientId && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/10 bg-[#2DD4BF]/5 px-2.5 py-1 text-[9px] font-semibold text-[#2DD4BF]">
                    Patient: {patientId.slice(0, 12)}...
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Table heading */}
          {!isLoading &&
            !isError &&
            readings.length > 0 && (
              <div className="hidden border-b border-white/[0.06] bg-white/[0.015] px-5 py-3 lg:grid lg:grid-cols-[minmax(190px,1.3fr)_150px_150px_minmax(160px,1fr)_110px] lg:gap-5">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8FA8A2]/55">
                  Patient
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8FA8A2]/55">
                  Heart rate
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8FA8A2]/55">
                  Temperature
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8FA8A2]/55">
                  Device
                </span>

                <span className="text-right text-[9px] font-bold uppercase tracking-[0.14em] text-[#8FA8A2]/55">
                  Status
                </span>
              </div>
            )}

          {/* Content */}
          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              onRetry={() => refetch()}
            />
          ) : readings.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              onClear={clearFilters}
            />
          ) : (
            <>
              <div>
                {readings.map((reading) => (
                  <ReadingRow
                    key={reading.id}
                    reading={reading}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[#8FA8A2]/55">
                  <Database className="h-3 w-3" />

                  Showing{" "}
                  <span className="font-bold text-[#D9E7E3]">
                    {readings.length}
                  </span>{" "}
                  loaded reading
                  {readings.length !== 1
                    ? "s"
                    : ""}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[#8FA8A2]/30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>

                  <span className="px-2 text-[10px] font-semibold text-[#8FA8A2]/60">
                    Cursor pagination
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      fetchNextPage()
                    }
                    disabled={
                      !hasNextPage ||
                      isFetchingNextPage
                    }
                    className="flex h-8 items-center gap-2 rounded-lg border border-[#2DD4BF]/15 bg-[#2DD4BF]/5 px-3 text-[10px] font-bold text-[#2DD4BF] transition hover:bg-[#2DD4BF]/10 disabled:cursor-not-allowed disabled:border-white/[0.06] disabled:bg-white/[0.02] disabled:text-[#8FA8A2]/30"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading
                      </>
                    ) : (
                      <>
                        Load more
                        <ChevronRight className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Monitoring note                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-start gap-3 rounded-2xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.025] px-4 py-3.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2DD4BF]/10">
            <Activity className="h-3.5 w-3.5 text-[#2DD4BF]" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#D9E7E3]">
              Remote monitoring
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-[#8FA8A2]/60">
              Readings displayed here are collected from
              registered monitoring devices. Review abnormal
              readings and associated alerts according to your
              organization&apos;s clinical workflow.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}