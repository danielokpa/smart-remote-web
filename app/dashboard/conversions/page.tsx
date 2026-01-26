"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { cngStationApi } from "@/lib/api";
import { StatusFilterDropdown } from "@/components/dashboard/conversions/StatusFilterDropdown";
import { CheckCircle2, AlertTriangle, XCircle, Filter } from "lucide-react";

type StatusFilter = "all" | "approved" | "pending" | "rejected";

interface Conversion {
  id: string;
  status: string;
  vehicleInfo?: any;
  createdAt?: string;
  applicantName?: string; // if your backend already sends it
  vehicleName?: string; // if your backend already sends it
  user?: any; // sometimes backend returns nested user
  [key: string]: any;
}

function normalizeStatus(
  status: string
): "approved" | "pending" | "rejected" | "other" {
  const s = (status || "").toLowerCase();
  if (s.includes("approved")) return "approved";
  if (s.includes("pending")) return "pending";
  if (s.includes("rejected")) return "rejected";
  return "other";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function safeText(v: unknown, fallback = "—") {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "string" && v.trim() === "") return fallback;
  return String(v);
}

/**
 * ✅ Update these helpers to match your real API payload shape.
 * They try common nested patterns without crashing.
 */
function pickApplicantName(c: Conversion) {
  return (
    c.applicantName ||
    c.fullName || // matches your entity field
    c?.vehicleInfo?.applicantName ||
    c?.vehicleInfo?.ownerName ||
    c?.vehicleInfo?.customer?.name ||
    c?.vehicleInfo?.user?.fullName ||
    c?.vehicleInfo?.user?.name ||
    c?.user?.fullName ||
    c?.user?.name ||
    "—"
  );
}

function pickVehicleName(c: Conversion) {
  return (
    c.vehicleName ||
    c.makeOfVehicle || // matches your entity field
    c?.vehicleInfo?.vehicleName ||
    c?.vehicleInfo?.name ||
    c?.vehicleInfo?.vehicle?.name ||
    c?.vehicle?.name ||
    c?.vehicleInfo?.plateNumber ||
    "—"
  );
}

function StatusPill({ status }: { status: string }) {
  const type = normalizeStatus(status);

  const pill = clsx(
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-manrope font-semibold border",
    type === "approved" && "bg-green-500/15 text-green-300 border-green-500/30",
    type === "pending" && "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    type === "rejected" && "bg-red-500/15 text-red-300 border-red-500/30",
    type === "other" && "bg-white/5 text-[#8E94A4] border-white/10"
  );

  const Icon =
    type === "approved"
      ? CheckCircle2
      : type === "pending"
      ? AlertTriangle
      : type === "rejected"
      ? XCircle
      : Filter;

  return (
    <span className={pill}>
      <Icon className="w-4 h-4" />
      {safeText(status, "N/A")}
    </span>
  );
}

export default function ConversionsPage() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchConversions = useCallback(
    async (page: number) => {
      setLoading(true);
      setError("");

      try {
        const response = await cngStationApi.getConversions(page, limit);

        if (response.success && response.data) {
          const list = (response.data.data || []) as Conversion[];

          setConversions(list);
          setCurrentPage(response.data.currentPage || page);
          setTotalPages(response.data.totalPages || 1);
          setTotal(response.data.total || 0);
        } else {
          setError(response.message || "Failed to load conversions");
        }
      } catch {
        setError("An error occurred while loading conversions");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchConversions(currentPage);
  }, [currentPage, fetchConversions]);

  // Derived: rows for table (memoized)
  const rows = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? conversions
        : conversions.filter((c) => normalizeStatus(c.status) === statusFilter);

    return filtered.map((c) => ({
      id: c.id,
      applicant: pickApplicantName(c),
      vehicle: pickVehicleName(c),
      status: c.status,
      createdAt: c.createdAt,
    }));
  }, [conversions, statusFilter]);

  const counts = useMemo(() => {
    const base = { approved: 0, pending: 0, rejected: 0 } as Record<
      "approved" | "pending" | "rejected",
      number
    >;

    for (const c of conversions) {
      const t = normalizeStatus(c.status);
      if (t === "approved" || t === "pending" || t === "rejected") base[t] += 1;
    }
    return base;
  }, [conversions]);

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-manrope font-bold text-[28px] md:text-[34px] leading-tight text-white">
            Conversions
          </h1>
          <p className="font-manrope font-medium text-[14px] md:text-[15px] text-[#8E94A4] mt-1">
            Track and manage conversion requests assigned to your station.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#251a34] border border-white/10 px-4 py-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-[#8E94A4]" />
              <StatusFilterDropdown
                value={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="mt-2 flex items-center gap-2 text-[12px] font-manrope text-[#8E94A4]">
              <span>Approved: {counts.approved}</span>
              <span className="text-white/15">•</span>
              <span>Pending: {counts.pending}</span>
              <span className="text-white/15">•</span>
              <span>Rejected: {counts.rejected}</span>
            </div>
          </div>
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

      {/* Table card */}
      <div className="rounded-2xl bg-[#251a34] border border-white/10 shadow-2xl overflow-hidden">
        {/* Card header */}
        <div className="px-5 md:px-6 py-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div>
            <p className="font-manrope font-bold text-white text-[16px]">
              Requests
            </p>
            <p className="font-manrope text-[#8E94A4] text-[12px] mt-1">
              {loading ? "Loading…" : `Showing ${rows.length} of ${total}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchConversions(currentPage)}
            className="px-4 py-2 rounded-full border border-white/10 text-white font-manrope font-semibold text-[13px] hover:bg-white/5 transition"
          >
            Refresh
          </button>
        </div>

        <div className="relative overflow-x-auto no-scrollbar overscroll-x-contain overscroll-y-none touch-pan-x">
          <table className="w-full min-w-[720px">
            <thead className="
              sticky top-0 z-20
              bg-[#251a34]/95 backdrop-blur
              border-b border-white/10
              md:static
            ">
              <tr className="border-b border-white/10">
                <th className="px-5 md:px-6 py-4 text-left font-manrope font-semibold text-[13px] text-white whitespace-nowrap">
                  Applicant
                </th>
                <th className="px-5 md:px-6 py-4 text-left font-manrope font-semibold text-[13px] text-white whitespace-nowrap">
                  Vehicle
                </th>
                <th className="px-5 md:px-6 py-4 text-left font-manrope font-semibold text-[13px] text-white whitespace-nowrap">
                  Status
                </th>
                <th className="px-5 md:px-6 py-4 text-left font-manrope font-semibold text-[13px] text-white whitespace-nowrap">
                  Created
                </th>
                <th className="px-5 md:px-6 py-4 text-right font-manrope font-semibold text-[13px] text-white whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading skeleton */}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-5 md:px-6 py-4">
                      <div className="h-4 w-44 bg-white/10 rounded animate-pulse" />
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <div className="h-4 w-36 bg-white/10 rounded animate-pulse" />
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <div className="h-7 w-28 bg-white/10 rounded-full animate-pulse" />
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    </td>
                    <td className="px-5 md:px-6 py-4 text-right">
                      <div className="h-8 w-20 ml-auto bg-white/10 rounded-full animate-pulse" />
                    </td>
                  </tr>
                ))}

              {/* Empty */}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="font-manrope font-semibold text-[15px] text-white">
                      No conversions found
                    </p>
                    <p className="font-manrope text-[13px] text-[#8E94A4] mt-1">
                      Try changing the filter or refreshing the list.
                    </p>
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!loading &&
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 md:px-6 py-4">
                      <div className="min-w-0">
                        <p className="font-manrope font-semibold text-[14px] text-white truncate">
                          {safeText(r.applicant)}
                        </p>
                        <p className="font-manrope text-[12px] text-[#8E94A4] mt-1">
                          #{r.id?.slice(0, 8)}…
                        </p>
                      </div>
                    </td>

                    <td className="px-5 md:px-6 py-4 font-manrope text-[14px] text-white">
                      {safeText(r.vehicle)}
                    </td>

                    <td className="px-5 md:px-6 py-4">
                      <StatusPill status={r.status} />
                    </td>

                    <td className="px-5 md:px-6 py-4 font-manrope text-[14px] text-[#8E94A4]">
                      {formatDate(r.createdAt)}
                    </td>

                    <td className="px-5 md:px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/conversions/${r.id}`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 text-white font-manrope font-semibold text-[12px] hover:bg-white/5 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-manrope font-medium text-[13px] text-[#8E94A4]">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full border border-white/10 text-white font-manrope font-semibold text-[13px] hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* compact pager */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const show =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                const isDots =
                  page === currentPage - 2 || page === currentPage + 2;

                if (show) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={clsx(
                        "px-4 py-2 rounded-full font-manrope font-semibold text-[13px] transition",
                        currentPage === page
                          ? "bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] text-white"
                          : "border border-white/10 text-white hover:bg-white/5"
                      )}
                    >
                      {page}
                    </button>
                  );
                }

                if (isDots) {
                  return (
                    <span key={page} className="px-2 text-[#8E94A4] font-manrope">
                      …
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full border border-white/10 text-white font-manrope font-semibold text-[13px] hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
