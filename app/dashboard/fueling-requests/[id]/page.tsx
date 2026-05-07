"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  Clock3,
  Droplets,
  Fuel,
  Gauge,
  Hash,
  Mail,
  Phone,
  RefreshCcw,
  StickyNote,
  User,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import { useStationApi } from "@/lib/hooks/stations/useStationApi";

/* ================= TYPES ================= */

type FuelingRequestDetails = {
  id: string;

  stationId: string;
  userId?: string;

  fullName: string;
  email: string;
  contactPhone: string;

  vehiclePlateNumber: string;
  vehicleBrand: string;
  vehicleModel?: string;

  currentFuelLevel: number;
  requestedFuelAmount?: number;

  scheduledAt?: string | Date;
  completedAt?: string | Date;

  status: string;
  note?: string;

  createdAt: string | Date;
  updatedAt: string | Date;
};

/* ================= HELPERS ================= */

function safeText(v: unknown, fallback = "—") {
  if (v === null || v === undefined) return fallback;

  if (typeof v === "string" && v.trim() === "") {
    return fallback;
  }

  return String(v);
}

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const d = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusMeta(status?: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("approved") || s.includes("completed")) {
    return {
      label: safeText(status),
      pill: "border-green-500/30 bg-green-500/15 text-green-300",
      icon: <CheckCircle2 className="h-4 w-4 text-green-300" />,
    };
  }

  if (s.includes("rejected") || s.includes("cancelled")) {
    return {
      label: safeText(status),
      pill: "border-red-500/30 bg-red-500/15 text-red-300",
      icon: <XCircle className="h-4 w-4 text-red-300" />,
    };
  }

  return {
    label: safeText(status),
    pill: "border-yellow-500/30 bg-yellow-500/15 text-yellow-300",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-300" />,
  };
}

function Field({
  icon,
  label,
  value,
  mono,
  multiline,
}: {
  icon: React.ReactNode;
  label: string;
  value: unknown;
  mono?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#2d1f3f] p-4">
      <div className="flex items-center gap-2 text-[#8E94A4]">
        {icon}

        <p className="text-[12px] font-medium">{label}</p>
      </div>

      <p
        className={clsx(
          "mt-2 text-[14px] font-semibold text-white",
          mono && "font-mono text-[13px]",
          multiline
            ? "whitespace-pre-wrap wrap-break-words"
            : "truncate"
        )}
      >
        {safeText(value)}
      </p>
    </div>
  );
}

/* ================= PAGE ================= */

export default function FuelingRequestDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const api = useStationApi();

  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] =
    useState<FuelingRequestDetails | null>(null);

  const meta = useMemo(
    () => statusMeta(data?.status),
    [data?.status]
  );

  const fetchDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      // replace with actual endpoint
      const res = await api.getActivityById?.(id);

      if (res?.success && res?.data) {
        setData(res.data);
      } else {
        setError(
          res?.message ||
            "Failed to load fueling request details."
        );
      }
    } catch {
      setError(
        "An error occurred while loading fueling request details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div>
            <h1 className="text-[30px] font-bold text-white md:text-[34px]">
              Fueling Request
            </h1>

            <p className="mt-1 text-sm text-[#8E94A4]">
              Review customer and fueling request details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
              meta.pill
            )}
          >
            {meta.icon}
            {meta.label}
          </span>

          <button
            type="button"
            onClick={fetchDetails}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/15 p-4">
          <p className="text-sm font-medium text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="rounded-3xl border border-white/10 bg-[#251a34] p-8 shadow-2xl">
          <div className="h-7 w-60 animate-pulse rounded bg-white/10" />

          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-white/10" />

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15">
                  <Fuel className="h-7 w-7 text-green-300" />
                </div>

                <div>
                  <p className="text-lg font-bold text-white">
                    {data.fullName}
                  </p>

                  <p className="text-sm text-[#8E94A4]">
                    CNG Fueling Customer
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={data.email}
                />

                <Field
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={data.contactPhone}
                />

                <Field
                  icon={<Hash className="h-4 w-4" />}
                  label="Request ID"
                  value={data.id}
                  mono
                />

                <Field
                  icon={<Calendar className="h-4 w-4" />}
                  label="Submitted"
                  value={formatDate(data.createdAt)}
                />
              </div>

              <Link
                href="/dashboard/fueling-requests"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Back to requests
              </Link>
            </div>
          </div>

          {/* MAIN */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
              <h2 className="text-[20px] font-bold text-white">
                Vehicle Information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  icon={<Car className="h-4 w-4" />}
                  label="Vehicle"
                  value={`${safeText(
                    data.vehicleBrand
                  )} • ${safeText(data.vehicleModel)}`}
                />

                <Field
                  icon={<Hash className="h-4 w-4" />}
                  label="Plate Number"
                  value={data.vehiclePlateNumber}
                  mono
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
              <h2 className="text-[20px] font-bold text-white">
                Fueling Details
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  icon={<Gauge className="h-4 w-4" />}
                  label="Current Fuel Level"
                  value={`${safeText(data.currentFuelLevel)}%`}
                />

                <Field
                  icon={<Droplets className="h-4 w-4" />}
                  label="Requested Fuel Amount"
                  value={
                    data.requestedFuelAmount
                      ? `${data.requestedFuelAmount} kg`
                      : "—"
                  }
                />

                <Field
                  icon={<Calendar className="h-4 w-4" />}
                  label="Scheduled Time"
                  value={formatDate(data.scheduledAt)}
                />

                <Field
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Completed At"
                  value={formatDate(data.completedAt)}
                />
              </div>
            </div>

            {data.note && (
              <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
                <h2 className="text-[20px] font-bold text-white">
                  Additional Note
                </h2>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#2d1f3f] p-4">
                  <div className="flex items-center gap-2 text-[#8E94A4]">
                    <StickyNote className="h-4 w-4" />

                    <p className="text-[12px]">
                      Customer note
                    </p>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-[14px] text-white">
                    {data.note}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !data && !error && (
        <div className="rounded-3xl border border-white/10 bg-[#251a34] p-8 shadow-2xl">
          <p className="text-[#8E94A4]">
            No fueling request found.
          </p>
        </div>
      )}
    </div>
  );
}