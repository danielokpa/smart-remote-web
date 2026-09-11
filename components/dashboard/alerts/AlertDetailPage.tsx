"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Cpu,
  HeartPulse,
  RefreshCw,
  Thermometer,
} from "lucide-react";

import { useAlert } from "@/lib/hooks/alerts/useAlerts";

import type {
  AuthScope,
} from "@/lib/types/auth/types";

import type {
  AlertStatus,
} from "@/lib/types/alerts/alerts";

interface AlertDetailPageProps {
  authScope: AuthScope;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
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
      return "Heart Rate";

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

function getParameterIcon(
  parameter: string
) {
  switch (parameter) {
    case "heart_rate":
      return HeartPulse;

    case "temperature":
      return Thermometer;

    default:
      return AlertTriangle;
  }
}

export default function AlertDetailPage({
  authScope,
}: AlertDetailPageProps) {
  const router = useRouter();

  const params = useParams<{
    id: string;
  }>();

  const alertId = params?.id;

  const {
    alert,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAlert(
    authScope,
    alertId
  );

  const isPatient =
    authScope === "PATIENT";

  const backHref = isPatient
    ? "/patient/dashboard/alerts"
    : "/dashboard/alerts";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-28 animate-pulse rounded-lg bg-white/5" />

        <div className="rounded-2xl border border-white/10 bg-[#0E2723] p-6">
          <div className="space-y-5">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-white/5" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded-lg bg-white/5" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-28 animate-pulse rounded-xl bg-white/5" />
              <div className="h-28 animate-pulse rounded-xl bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !alert) {
    return (
      <div className="space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-manrope text-sm font-semibold text-[#8FA8A2] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to alerts
        </Link>

        <div className="rounded-2xl border border-red-400/15 bg-[#0E2723] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/10">
              <AlertTriangle className="h-5 w-5 text-red-300" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="font-manrope text-lg font-bold text-white">
                Unable to load alert
              </h1>

              <p className="mt-2 font-manrope text-sm leading-6 text-[#8FA8A2]">
                {error instanceof Error
                  ? error.message
                  : "The requested alert could not be loaded."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2.5 font-manrope text-sm font-semibold text-white transition hover:bg-white/5"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ParameterIcon =
    getParameterIcon(alert.parameter);

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------------- */}
      {/* Back                                                              */}
      {/* ---------------------------------------------------------------- */}

      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-manrope text-sm font-semibold text-[#8FA8A2] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to alerts
        </Link>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ---------------------------------------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/10">
            <ParameterIcon className="h-6 w-6 text-red-300" />
          </div>

          <div>
            <p className="font-manrope text-xs font-semibold uppercase tracking-[0.12em] text-[#6F8982]">
              {isPatient
                ? "Personal health alert"
                : "Health alert"}
            </p>

            <h1 className="mt-1 font-manrope text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {getParameterLabel(
                alert.parameter
              )}
            </h1>

            <p className="mt-2 font-manrope text-sm text-[#8FA8A2]">
              Alert generated from a health
              monitoring reading.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 font-manrope text-xs font-semibold ${getStatusClasses(
              alert.status
            )}`}
          >
            {getStatusLabel(alert.status)}
          </span>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0E2723] text-[#8FA8A2] transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            aria-label="Refresh alert"
            title="Refresh alert"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Alert value                                                       */}
      {/* ---------------------------------------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0E2723] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/10">
              <ParameterIcon className="h-5 w-5 text-red-300" />
            </div>

            <div>
              <p className="font-manrope text-xs text-[#718A84]">
                Alert parameter
              </p>

              <p className="mt-1 font-manrope font-semibold text-white">
                {getParameterLabel(
                  alert.parameter
                )}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-manrope text-xs text-[#718A84]">
              Recorded value
            </p>

            <p className="mt-1 font-manrope text-3xl font-bold text-white">
              {alert.value}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0E2723] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
              <Clock3 className="h-5 w-5 text-[#8FA8A2]" />
            </div>

            <div>
              <p className="font-manrope text-xs text-[#718A84]">
                Alert created
              </p>

              <p className="mt-1 font-manrope font-semibold text-white">
                {formatDate(
                  alert.createdAt
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Patient information                                               */}
      {/* ---------------------------------------------------------------- */}

      <div className="rounded-2xl border border-white/10 bg-[#0E2723]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-manrope font-bold text-white">
            {isPatient
              ? "Your information"
              : "Patient information"}
          </h2>

          <p className="mt-1 font-manrope text-xs text-[#718A84]">
            {isPatient
              ? "Patient associated with this alert."
              : "Patient associated with this health alert."}
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Name
            </p>

            <p className="mt-1 font-manrope text-sm font-semibold text-white">
              {alert.patient.firstName}{" "}
              {alert.patient.lastName}
            </p>
          </div>

          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Gender
            </p>

            <p className="mt-1 font-manrope text-sm font-semibold text-white">
              {alert.patient.gender}
            </p>
          </div>

          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Contact
            </p>

            <p className="mt-1 font-manrope text-sm font-semibold text-white">
              {alert.patient.contact}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Underlying reading                                                */}
      {/* ---------------------------------------------------------------- */}

      <div className="rounded-2xl border border-white/10 bg-[#0E2723]">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10">
              <HeartPulse className="h-4 w-4 text-[#2DD4BF]" />
            </div>

            <div>
              <h2 className="font-manrope font-bold text-white">
                Underlying health reading
              </h2>

              <p className="mt-1 font-manrope text-xs text-[#718A84]">
                Reading that generated this alert.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Heart rate
            </p>

            <p className="mt-1 font-manrope text-lg font-bold text-white">
              {alert.reading.heartRate}{" "}
              <span className="text-xs font-medium text-[#718A84]">
                bpm
              </span>
            </p>
          </div>

          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Temperature
            </p>

            <p className="mt-1 font-manrope text-lg font-bold text-white">
              {alert.reading.temperature}
            </p>
          </div>

          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Recorded
            </p>

            <p className="mt-1 font-manrope text-sm font-semibold text-white">
              {formatDate(
                alert.reading.recordedAt
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Technical information                                             */}
      {/* ---------------------------------------------------------------- */}

      <div className="rounded-2xl border border-white/10 bg-[#0E2723]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-manrope font-bold text-white">
            Technical information
          </h2>

          <p className="mt-1 font-manrope text-xs text-[#718A84]">
            Identifiers associated with this alert.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Alert ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-[#A8BCB7]">
              {alert.id}
            </p>
          </div>

          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Reading ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-[#A8BCB7]">
              {alert.readingId}
            </p>
          </div>

          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Patient ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-[#A8BCB7]">
              {alert.patientId}
            </p>
          </div>

          <div>
            <p className="font-manrope text-xs text-[#718A84]">
              Device ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-[#A8BCB7]">
              {alert.reading.deviceId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}