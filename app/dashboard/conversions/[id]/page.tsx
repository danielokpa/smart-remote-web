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
import { cngStationApi } from "@/lib/api";

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
  if (typeof v === "string" && v.trim() === "") return fallback;
  return String(v);
}

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function statusMeta(status?: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("approved")) {
    return {
      label: "Approved",
      pill: "bg-green-500/15 border border-green-500/30 text-green-300",
      icon: <BadgeCheck className="w-4 h-4 text-green-300" />,
    };
  }
  if (s.includes("rejected")) {
    return {
      label: "Rejected",
      pill: "bg-red-500/15 border border-red-500/30 text-red-300",
      icon: <XCircle className="w-4 h-4 text-red-300" />,
    };
  }
  return {
    label: "Pending",
    pill: "bg-yellow-500/15 border border-yellow-500/30 text-yellow-300",
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
    <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
      <div className="flex items-center gap-2 text-[#8E94A4]">
        <span className="shrink-0">{icon}</span>
        <p className="font-manrope text-[12px]">{label}</p>
      </div>

      <p
        className={clsx(
          "mt-2 font-manrope font-semibold text-[14px] text-white",
          mono && "font-mono text-[13px]",
          multiline ? "whitespace-pre-wrap break-words" : "truncate"
        )}
        title={typeof value === "string" ? value : undefined}
      >
        {safeText(value)}
      </p>
    </div>
  );
}

/**
 * ✅ Route suggestion (App Router):
 * app/dashboard/conversions/[id]/page.tsx
 *
 * ✅ API suggestion:
 * cngStationApi.getConversionById(id)
 * -> { success, data, message }
 */
export default function ConversionDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ConversionDetails | null>(null);

  const meta = useMemo(() => statusMeta(data?.status), [data?.status]);

  const fetchDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      // ✅ Replace this with your real endpoint name
      const res = await (cngStationApi as any).getConversionById?.(id);

      if (res?.success && res?.data) {
        setData(res.data as ConversionDetails);
      } else {
        setError(res?.message || "Failed to load conversion details.");
      }
    } catch {
      setError("An error occurred while loading conversion details.");
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
      {/* Top row */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 transition flex items-center justify-center"
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div>
            <h1 className="font-manrope font-bold text-[28px] md:text-[34px] leading-tight text-white">
              Conversion Details
            </h1>
            <p className="font-manrope text-[#8E94A4] text-[14px] md:text-[15px] mt-1">
              Review applicant and vehicle information for this request.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "inline-flex items-center gap-2 px-3 py-2 rounded-full text-[13px] font-manrope font-semibold",
              meta.pill
            )}
          >
            {meta.icon}
            {meta.label}
          </span>

          <button
            type="button"
            onClick={fetchDetails}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white font-manrope font-semibold text-[14px] hover:bg-white/5 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl p-4 bg-red-500/15 border border-red-500/30">
          <p className="font-manrope font-medium text-[14px] text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 md:p-8 shadow-2xl">
          <div className="h-6 w-1/3 bg-white/10 rounded animate-pulse" />
          <div className="mt-2 h-4 w-2/3 bg-white/10 rounded animate-pulse" />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-white/10 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: summary card */}
          <div className="lg:col-span-1">
            <div className="relative rounded-2xl bg-[#251a34] border border-white/10 p-6 shadow-2xl overflow-hidden">
              {/* glow */}
              <div
                className="absolute w-[70%] aspect-square -top-10 -right-10 opacity-40 rounded-full blur-[110px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
                }}
              />

              <div className="relative z-10">
                <p className="font-manrope font-bold text-white text-[18px]">
                  Applicant
                </p>

                <div className="mt-4 space-y-3">
                  <Field
                    icon={<User className="w-4 h-4" />}
                    label="Full Name"
                    value={data.fullName}
                  />
                  <Field
                    icon={<Mail className="w-4 h-4" />}
                    label="Email"
                    value={data.email}
                  />
                  <Field
                    icon={<Phone className="w-4 h-4" />}
                    label="Phone"
                    value={data.contactPhone}
                  />

                  <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-[#8E94A4]">
                      <Hash className="w-4 h-4" />
                      <p className="font-manrope text-[12px]">Request ID</p>
                    </div>
                    <p className="mt-2 font-mono text-[12px] text-white break-all">
                      {data.id}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-[#8E94A4]">
                      <Calendar className="w-4 h-4" />
                      <p className="font-manrope text-[12px]">Submitted</p>
                    </div>
                    <p className="mt-2 font-manrope font-semibold text-[14px] text-white">
                      {formatDate(data.createdAt)}
                    </p>

                    <p className="mt-2 font-manrope text-[12px] text-[#8E94A4]">
                      Last updated: {formatDate(data.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href="/dashboard/conversions"
                    className="inline-flex items-center justify-center w-full rounded-full px-5 py-3 border border-white/10 text-white font-manrope font-semibold text-[14px] hover:bg-white/5 transition"
                  >
                    Back to list
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right: details sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle */}
            <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 md:p-8 shadow-2xl">
              <p className="font-manrope font-bold text-white text-[18px]">
                Vehicle Details
              </p>
              <p className="font-manrope text-[#8E94A4] text-[13px] mt-1">
                Key information required to validate the conversion request.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  icon={<Car className="w-4 h-4" />}
                  label="Vehicle (Brand / Make)"
                  value={`${safeText(data.brandOfVehicle)} • ${safeText(
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
            <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 md:p-8 shadow-2xl">
              <p className="font-manrope font-bold text-white text-[18px]">
                Technical Snapshot
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Location/Route */}
            <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 md:p-8 shadow-2xl">
              <p className="font-manrope font-bold text-white text-[18px]">
                Location & Usage
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  icon={<MapPin className="w-4 h-4" />}
                  label="State / LGA"
                  value={`${safeText(data.residentialState)} • ${safeText(
                    data.lga
                  )}`}
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
              <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 md:p-8 shadow-2xl">
                <p className="font-manrope font-bold text-white text-[18px]">
                  Additional Note
                </p>

                <div className="mt-4 rounded-2xl bg-[#2d1f3f] border border-white/10 p-4">
                  <div className="flex items-center gap-2 text-[#8E94A4]">
                    <StickyNote className="w-4 h-4" />
                    <p className="font-manrope text-[12px]">Applicant note</p>
                  </div>

                  <p className="mt-2 font-manrope text-[14px] text-white whitespace-pre-wrap">
                    {data.additionalNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !data && !error && (
        <div className="rounded-2xl bg-[#251a34] border border-white/10 p-8 shadow-2xl">
          <p className="font-manrope text-[#8E94A4]">
            No data found for this conversion.
          </p>
        </div>
      )}
    </div>
  );
}
