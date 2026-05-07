"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  ArrowUpRight,
} from "lucide-react";

import { useStationApi } from "@/lib/hooks/stations/useStationApi";
import TableSkeleton from "@/components/dashboard/TableSkeleton";
import CursorPagination from "@/components/dashboard/CursorPagination";
import RequestsTable, {
  TableColumn,
} from "@/components/dashboard/RequestsTable";

type StatusFilter = "all" | "approved" | "pending" | "rejected";

interface ChargingRequest {
  id: string;
  status: string;
  createdAt?: string;
  fullName?: string;
  vehicleBrand?: string;
  [key: string]: any;
}

/* ================= HELPERS ================= */

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
  if (!v) return fallback;

  if (typeof v === "string" && v.trim() === "") {
    return fallback;
  }

  return String(v);
}

/* ================= STATUS PILL ================= */

function StatusPill({ status }: { status: string }) {
  const type = normalizeStatus(status);

  const Icon =
    type === "approved"
      ? CheckCircle2
      : type === "pending"
      ? AlertTriangle
      : type === "rejected"
      ? XCircle
      : Filter;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium",
        type === "approved" &&
          "border-green-500/30 bg-green-500/15 text-green-300",
        type === "pending" &&
          "border-yellow-500/30 bg-yellow-500/15 text-yellow-300",
        type === "rejected" &&
          "border-red-500/30 bg-red-500/15 text-red-300",
        type === "other" &&
          "border-white/10 bg-white/5 text-[#8E94A4]"
      )}
    >
      <Icon className="h-4 w-4" />
      {safeText(status)}
    </span>
  );
}

/* ================= PAGE ================= */

export default function ChargingRequestsPage() {
  const api = useStationApi();
  const router = useRouter();

  const [list, setList] = useState<ChargingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevStack, setPrevStack] = useState<string[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const limit = 10;

  /* ================= FETCH ================= */

  const fetchData = useCallback(async () => {
    if (!list.length) {
      setLoading(true);
    }

    setError("");

    try {
      const res = await api.fetchDashboard({
        cursor,
        limit,
      });

      if (res.success && res.data) {
        setList(res.data.data || []);
        setNextCursor(res.data.nextCursor || null);
      } else {
        setError(res.message || "Failed to load requests");
      }
    } catch {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [cursor, api, list.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= ROWS ================= */

  const rows = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? list
        : list.filter(
            (i) => normalizeStatus(i.status) === statusFilter
          );

    return filtered.map((item) => ({
      id: item.id,
      applicant: safeText(item.fullName),
      vehicle: safeText(item.vehicleBrand),
      status: item.status,
      createdAt: item.createdAt,
    }));
  }, [list, statusFilter]);

  /* ================= TABLE COLUMNS ================= */

  const columns: TableColumn<(typeof rows)[number]>[] = [
    {
      key: "applicant",
      title: "Applicant",
      align: "left",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">
            {row.applicant}
          </p>

          <p className="mt-1 text-xs text-[#8E94A4]">
            #{row.id.slice(0, 8)}
          </p>
        </div>
      ),
    },

    {
      key: "vehicle",
      title: "Vehicle",
      align: "left",
      render: (row) => (
        <span className="text-white">
          {safeText(row.vehicle)}
        </span>
      ),
    },

    {
      key: "status",
      title: "Status",
      align: "center",
      render: (row) => (
        <div className="flex justify-center">
          <StatusPill status={row.status} />
        </div>
      ),
    },

    {
      key: "createdAt",
      title: "Date",
      align: "center",
      render: (row) => (
        <span className="text-[#B8BCC8]">
          {formatDate(row.createdAt)}
        </span>
      ),
    },

    {
      key: "action",
      title: "Action",
      align: "center",
      render: () => (
        <div
          className="
            inline-flex items-center gap-2
            rounded-full
            border border-white/10
            bg-white/[0.03]
            px-4 py-2
            text-sm font-medium text-white
            transition-all
            group-hover:border-white/20
            group-hover:bg-white/[0.05]
          "
        >
          View Details

          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      ),
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-white">
            Charging Requests
          </h1>

          <p className="mt-1 text-sm text-[#8E94A4]">
            Track and manage charging requests assigned to
            your station.
          </p>
        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#251a34] shadow-2xl">
        <RequestsTable
          columns={columns}
          data={rows}
          loading={loading}
          skeleton={<TableSkeleton rows={6} columns={5} />}
          rowKey={(row) => row.id}
          onRowClick={(row) =>
            router.push(
              `/dashboard/charging-requests/${row.id}`
            )
          }
          emptyTitle="No charging requests found"
          emptyDescription="Try changing filters or refreshing"
        />
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-[#8E94A4]">
          Showing {rows.length} results
        </p>

        <CursorPagination
          hasPrev={prevStack.length > 0}
          hasNext={!!nextCursor}
          onPrev={() => {
            const prev = [...prevStack];
            const last = prev.pop() || null;

            setPrevStack(prev);
            setCursor(last);
          }}
          onNext={() => {
            if (!nextCursor) return;

            setPrevStack((s) =>
              cursor ? [...s, cursor] : s
            );

            setCursor(nextCursor);
          }}
        />
      </div>
    </div>
  );
}