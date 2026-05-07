"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  User,
  Car,
  BadgeCheck,
  AlertTriangle,
  XCircle,
  Hash,
  MapPin,
  Gauge,
  Fuel,
  Cog,
  StickyNote,
  RefreshCcw,
} from "lucide-react";

import { useStationApi } from "@/lib/hooks/stations/useStationApi";

type ConversionDetails = {
  id: string;

  // applicant
  fullName: string;
  email: string;
  contactPhone?: string | null;

  // status + timestamps
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  // vehicle
  vehicleRegisterationNo?: string | null;
  brandOfVehicle?: string | null;
  makeOfVehicle?: string | null;
  yearOfManufacture?: string | null;
  color?: string | null;

  // technical
  fuelType?: string | null;
  transmission?: string | null;
  engineCondition?: string | null;
  engineCapacity?: string | null;
  cylinder?: string | null;
  mileage?: string | null;

  // location/usage
  residentialState?: string | null;
  lga?: string | null;
  address?: string | null;
  usualRoute?: string | null;
  operatingMotorPark?: string | null;

  // optional
  additionalNote?: string | null;
};

function safeText(v: unknown, fallback = "—") {
  if (v === null || v === undefined) return fallback;

  if (typeof v === "string" && v.trim() === "") {
    return fallback;
  }

  return String(v);
}

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(d.getTime())) {
    return String(value);
  }

  return d.toLocaleString();
}

function statusMeta(status?: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("approved")) {
    return {
      label: "Approved",
      pill: "bg-green-500/15 border border-green-500/30 text-green-300",
      dot: "bg-green-400",
      icon: <BadgeCheck className="w-4 h-4 text-green-300" />,
    };
  }

  if (s.includes("rejected")) {
    return {
      label: "Rejected",
      pill: "bg-red-500/15 border border-red-500/30 text-red-300",
      dot: "bg-red-400",
      icon: <XCircle className="w-4 h-4 text-red-300" />,
    };
  }

  return {
    label: "Pending",
    pill: "bg-yellow-500/15 border border-yellow-500/30 text-yellow-300",
    dot: "bg-yellow-400",
    icon: <AlertTriangle className="w-4 h-4 text-yellow-300" />,
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
        <span className="shrink-0">{icon}</span>

        <p className="font-manrope text-[12px]">
          {label}
        </p>
      </div>

      <p
        className={clsx(
          "mt-2 font-manrope text-[14px] font-semibold text-white",
          mono && "font-mono text-[13px]",
          multiline
            ? "whitespace-pre-wrap break-words"
            : "truncate"
        )}
        title={typeof value === "string" ? value : undefined}
      >
        {safeText(value)}
      </p>
    </div>
  );
}

export default function ConversionDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const api = useStationApi();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] =
    useState<ConversionDetails | null>(null);

  const meta = useMemo(
    () => statusMeta(data?.status),
    [data?.status]
  );

  const fetchDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.getActivityById?.(id);

      if (res?.success && res?.data) {
        setData(res.data as ConversionDetails);
      } else {
        setError(
          res?.message ||
            "Failed to load conversion details."
        );
      }
    } catch {
      setError(
        "An error occurred while loading conversion details."
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
      {/* ================= TOP BAR ================= */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-white/10
              transition hover:bg-white/5
            "
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div>
            <h1 className="text-[28px] font-bold leading-tight text-white md:text-[34px]">
              Conversion Details
            </h1>

            <p className="mt-1 text-[14px] text-[#8E94A4] md:text-[15px]">
              Review applicant and vehicle information
              for this request.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold",
              meta.pill
            )}
          >
            {meta.icon}
            {meta.label}
          </span>

          <button
            type="button"
            onClick={fetchDetails}
            className="
              inline-flex items-center gap-2
              rounded-full border border-white/10
              px-4 py-2
              text-[14px] font-semibold text-white
              transition hover:bg-white/5
            "
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/15 p-4">
          <p className="text-[14px] font-medium text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
          <div className="h-6 w-1/3 animate-pulse rounded bg-white/10" />

          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-white/10" />

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      {!loading && data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl">
              {/* Glow */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-[120px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(138,37,233,0.7) 0%, rgba(117,31,198,0.35) 45%, rgba(78,21,131,0) 100%)",
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="
                      flex h-16 w-16 items-center justify-center
                      rounded-2xl border border-white/10
                      bg-[#2d1f3f]
                    "
                  >
                    <User className="h-8 w-8 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8E94A4]">
                      Applicant
                    </p>

                    <h2 className="mt-1 truncate text-[22px] font-bold text-white">
                      {safeText(data.fullName)}
                    </h2>

                    <div
                      className="
                        mt-3 inline-flex items-center gap-2
                        rounded-full border border-white/10
                        bg-white/[0.04]
                        px-3 py-1.5
                      "
                    >
                      <span
                        className={clsx(
                          "h-2 w-2 rounded-full",
                          meta.dot
                        )}
                      />

                      <span className="text-xs font-medium text-[#D7DBE4]">
                        {meta.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-white/10" />

                {/* Customer Fields */}
                <div className="space-y-4">
                  <Field
                    icon={<Mail className="w-4 h-4" />}
                    label="Email Address"
                    value={data.email}
                  />

                  <Field
                    icon={<Phone className="w-4 h-4" />}
                    label="Phone Number"
                    value={data.contactPhone}
                  />

                  {/* Request ID */}
                  <div className="rounded-2xl border border-white/10 bg-[#2d1f3f] p-4">
                    <div className="flex items-center gap-2 text-[#8E94A4]">
                      <Hash className="h-4 w-4" />

                      <p className="text-[12px] font-medium">
                        Request ID
                      </p>
                    </div>

                    <div
                      className="
                        mt-3 rounded-xl border border-white/5
                        bg-black/20 px-3 py-2
                      "
                    >
                      <p className="break-all font-mono text-[12px] text-white">
                        {data.id}
                      </p>
                    </div>
                  </div>

                  {/* Submission */}
                  <div className="rounded-2xl border border-white/10 bg-[#2d1f3f] p-4">
                    <div className="flex items-center gap-2 text-[#8E94A4]">
                      <Calendar className="h-4 w-4" />

                      <p className="text-[12px] font-medium">
                        Submission Details
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[#8E94A4]">
                          Submitted At
                        </p>

                        <p className="mt-1 text-[14px] font-semibold text-white">
                          {formatDate(data.createdAt)}
                        </p>
                      </div>

                      <div className="h-px bg-white/10" />

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[#8E94A4]">
                          Last Updated
                        </p>

                        <p className="mt-1 text-[14px] font-semibold text-white">
                          {formatDate(data.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6">
                  <Link
                    href="/dashboard/conversions"
                    className="
                      inline-flex w-full items-center justify-center
                      rounded-2xl border border-white/10
                      bg-white/[0.03]
                      px-5 py-3
                      text-sm font-semibold text-white
                      transition-all
                      hover:border-white/20
                      hover:bg-white/[0.06]
                    "
                  >
                    Back to Requests
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="space-y-6 lg:col-span-2">
            {/* Vehicle */}
            <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
              <p className="text-[18px] font-bold text-white">
                Vehicle Details
              </p>

              <p className="mt-1 text-[13px] text-[#8E94A4]">
                Key information required to validate
                the conversion request.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  icon={<Car className="w-4 h-4" />}
                  label="Vehicle (Brand / Make)"
                  value={`${safeText(
                    data.brandOfVehicle
                  )} • ${safeText(
                    data.makeOfVehicle
                  )}`}
                />

                <Field
                  icon={<Hash className="w-4 h-4" />}
                  label="Registration No."
                  value={data.vehicleRegisterationNo}
                  mono
                />

                <Field
                  icon={<Calendar className="w-4 h-4" />}
                  label="Year"
                  value={data.yearOfManufacture}
                />

                <Field
                  icon={<Car className="w-4 h-4" />}
                  label="Color"
                  value={data.color}
                />
              </div>
            </div>

            {/* Technical */}
            <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
              <p className="text-[18px] font-bold text-white">
                Technical Snapshot
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  icon={<Fuel className="w-4 h-4" />}
                  label="Fuel Type"
                  value={data.fuelType}
                />

                <Field
                  icon={<Cog className="w-4 h-4" />}
                  label="Transmission"
                  value={data.transmission}
                />

                <Field
                  icon={<Cog className="w-4 h-4" />}
                  label="Engine Condition"
                  value={data.engineCondition}
                />

                <Field
                  icon={<Gauge className="w-4 h-4" />}
                  label="Mileage"
                  value={data.mileage}
                />

                <Field
                  icon={<Cog className="w-4 h-4" />}
                  label="Engine Capacity"
                  value={data.engineCapacity}
                />

                <Field
                  icon={<Cog className="w-4 h-4" />}
                  label="Cylinders"
                  value={data.cylinder}
                />
              </div>
            </div>

            {/* Location */}
            <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
              <p className="text-[18px] font-bold text-white">
                Location & Usage
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  icon={<MapPin className="w-4 h-4" />}
                  label="State / LGA"
                  value={`${safeText(
                    data.residentialState
                  )} • ${safeText(data.lga)}`}
                />

                <Field
                  icon={<MapPin className="w-4 h-4" />}
                  label="Address"
                  value={data.address}
                  multiline
                />

                <Field
                  icon={<MapPin className="w-4 h-4" />}
                  label="Usual Route"
                  value={data.usualRoute}
                  multiline
                />

                <Field
                  icon={<MapPin className="w-4 h-4" />}
                  label="Operating Motor Park"
                  value={data.operatingMotorPark}
                />
              </div>
            </div>

            {/* Note */}
            {data.additionalNote && (
              <div className="rounded-3xl border border-white/10 bg-[#251a34] p-6 shadow-2xl md:p-8">
                <p className="text-[18px] font-bold text-white">
                  Additional Note
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#2d1f3f] p-4">
                  <div className="flex items-center gap-2 text-[#8E94A4]">
                    <StickyNote className="h-4 w-4" />

                    <p className="text-[12px]">
                      Applicant note
                    </p>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-[14px] text-white">
                    {data.additionalNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && !data && !error && (
        <div className="rounded-3xl border border-white/10 bg-[#251a34] p-8 shadow-2xl">
          <p className="text-[#8E94A4]">
            No data found for this conversion.
          </p>
        </div>
      )}
    </div>
  );
}