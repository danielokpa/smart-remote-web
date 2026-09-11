"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useAlerts } from "@/lib/hooks/alerts/useAlerts";
import type { AuthScope } from "@/lib/types/auth/types";
import type {
  AlertStatus,
} from "@/lib/types/alerts/alerts";

interface AlertsPageProps {
  authScope: AuthScope;
}

function formatDate(
  value: string
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
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
      return "border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#5EEAD4]";

    case "DISMISSED":
      return "border-white/10 bg-white/5 text-[#8FA8A2]";

    default:
      return "border-white/10 bg-white/5 text-[#8FA8A2]";
  }
}

function getParameterLabel(
  parameter: string
): string {
  switch (parameter) {
    case "heart_rate":
      return "Heart rate";

    case "temperature":
      return "Temperature";

    default:
      return parameter
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        );
  }
}

export default function AlertsPage({
  authScope,
}: AlertsPageProps) {
  const {
    alerts,
    isLoading,
    isFetching,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useAlerts(authScope, {
    limit: 20,
  });

  const isPatient =
    authScope === "PATIENT";

  const activeAlerts =
    alerts.filter(
      (alert) =>
        alert.status === "ACTIVE"
    ).length;

  const resolvedAlerts =
    alerts.filter(
      (alert) =>
        alert.status === "RESOLVED"
    ).length;

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#0E2723]">
              <Bell className="h-4.5 w-4.5 text-[#2DD4BF]" />
            </div>

            <span className="font-manrope text-xs font-semibold uppercase tracking-[0.12em] text-[#6F8982]">
              {isPatient
                ? "Personal health"
                : "Health monitoring"}
            </span>
          </div>

          <h1 className="font-manrope text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {isPatient
              ? "My Health Alerts"
              : "Health Alerts"}
          </h1>

          <p className="mt-2 max-w-2xl font-manrope text-sm leading-6 text-[#8FA8A2]">
            {isPatient
              ? "Review alerts generated from your recent health readings."
              : "Monitor health alerts generated from patient readings."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0E2723] px-4 font-manrope text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0E2723] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-manrope text-xs font-medium text-[#718A84]">
                  Total alerts
                </p>

                <p className="mt-2 font-manrope text-2xl font-bold text-white">
                  {alerts.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
                <Bell className="h-5 w-5 text-[#8FA8A2]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-400/10 bg-[#0E2723] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-manrope text-xs font-medium text-[#718A84]">
                  Active alerts
                </p>

                <p className="mt-2 font-manrope text-2xl font-bold text-white">
                  {activeAlerts}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/10">
                <AlertTriangle className="h-5 w-5 text-red-300" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#2DD4BF]/10 bg-[#0E2723] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-manrope text-xs font-medium text-[#718A84]">
                  Resolved
                </p>

                <p className="mt-2 font-manrope text-2xl font-bold text-white">
                  {resolvedAlerts}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2DD4BF]/10 bg-[#2DD4BF]/10">
                <CheckCircle2 className="h-5 w-5 text-[#5EEAD4]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Loading                                                             */}
      {/* ------------------------------------------------------------------ */}

      {isLoading && (
        <div className="rounded-2xl border border-white/10 bg-[#0E2723] p-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-[#2DD4BF]" />

            <p className="font-manrope text-sm text-[#8FA8A2]">
              Loading your alerts...
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                               */}
      {/* ------------------------------------------------------------------ */}

      {isError && (
        <div className="rounded-2xl border border-red-400/15 bg-[#0E2723] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/10">
              <AlertTriangle className="h-5 w-5 text-red-300" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-manrope font-semibold text-white">
                Unable to load alerts
              </h2>

              <p className="mt-1 font-manrope text-sm text-[#8FA8A2]">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while loading your alerts."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-manrope text-sm font-semibold text-white transition hover:bg-white/5"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Empty state                                                         */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading &&
        !isError &&
        alerts.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#0E2723] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
              <CheckCircle2 className="h-6 w-6 text-[#2DD4BF]" />
            </div>

            <h2 className="mt-4 font-manrope text-lg font-bold text-white">
              No health alerts
            </h2>

            <p className="mx-auto mt-2 max-w-md font-manrope text-sm leading-6 text-[#718A84]">
              {isPatient
                ? "There are currently no health alerts associated with your monitoring."
                : "There are currently no health alerts to review."}
            </p>
          </div>
        )}

      {/* ------------------------------------------------------------------ */}
      {/* Alerts                                                              */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading &&
        !isError &&
        alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                href={
                  isPatient
                    ? `/patient/dashboard/alerts/${alert.id}`
                    : `/dashboard/alerts/${alert.id}`
                }
                className="group block rounded-2xl border border-white/10 bg-[#0E2723] p-5 transition hover:border-white/15 hover:bg-white/[0.025]"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/10">
                    <AlertTriangle className="h-5 w-5 text-red-300" />
                  </div>

                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-manrope font-semibold text-white">
                          {getParameterLabel(
                            alert.parameter
                          )}
                        </h3>

                        <p className="mt-1 font-manrope text-sm text-[#8FA8A2]">
                          Alert value:{" "}
                          <span className="font-semibold text-white">
                            {alert.value}
                          </span>
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 font-manrope text-xs font-semibold ${getStatusClasses(
                          alert.status
                        )}`}
                      >
                        {getStatusLabel(
                          alert.status
                        )}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-3.5 w-3.5 text-[#718A84]" />

                        <span className="font-manrope text-xs text-[#718A84]">
                          {formatDate(
                            alert.createdAt
                          )}
                        </span>
                      </div>

                      {!isPatient && (
                        <div className="font-manrope text-xs text-[#718A84]">
                          {alert.patient.firstName}{" "}
                          {alert.patient.lastName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      {/* ------------------------------------------------------------------ */}
      {/* Load more                                                           */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading &&
        !isError &&
        hasNextPage && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                fetchNextPage()
              }
              disabled={
                isFetchingNextPage
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E2723] px-5 py-2.5 font-manrope text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetchingNextPage && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isFetchingNextPage
                ? "Loading..."
                : "Load more alerts"}
            </button>
          </div>
        )}
    </div>
  );
}