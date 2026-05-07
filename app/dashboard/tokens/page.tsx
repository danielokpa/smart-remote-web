"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useStationApi } from "@/lib/hooks/stations/useStationApi";
import TableSkeleton from "@/components/dashboard/TableSkeleton";
import CursorPagination from "@/components/dashboard/CursorPagination";
import {
  Wallet,
  TrendingUp,
  Activity,
  RefreshCcw,
  Filter,
} from "lucide-react";

type TokenSale = {
  id: string;
  amount: number;
  tokens: number;
  customerName?: string;
  createdAt?: string;
  status: string;
};

type StatusFilter = "all" | "success" | "pending" | "failed";

function formatCurrency(n?: number) {
  if (!n) return "₦0";
  return `₦${n.toLocaleString()}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function normalizeStatus(
  status: string
): "success" | "pending" | "failed" | "other" {
  const s = (status || "").toLowerCase();
  if (s.includes("success")) return "success";
  if (s.includes("pending")) return "pending";
  if (s.includes("fail")) return "failed";
  return "other";
}

function StatusPill({ status }: { status: string }) {
  const type = normalizeStatus(status);

  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full text-[12px] font-semibold border",
        type === "success" && "bg-green-500/15 text-green-300 border-green-500/30",
        type === "pending" && "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
        type === "failed" && "bg-red-500/15 text-red-300 border-red-500/30",
        type === "other" && "bg-white/5 text-[#8E94A4] border-white/10"
      )}
    >
      {status}
    </span>
  );
}

export default function TokenSalesPage() {
  const api = useStationApi();

  const [list, setList] = useState<TokenSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevStack, setPrevStack] = useState<string[]>([]);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const limit = 10;

  const fetchData = useCallback(async () => {
    if (!list.length) setLoading(true);
    setError("");

    try {
      const res = await api.fetchTokenSales?.();

      if (res?.success && res?.data) {
        setList(res.data.data || []);
        setNextCursor(res.data.nextCursor || null);
      } else {
        setError(res?.message || "Failed to load sales");
      }
    } catch {
      setError("Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, [cursor, api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ filtered list
  const filtered = useMemo(() => {
    if (statusFilter === "all") return list;
    return list.filter(
      (i) => normalizeStatus(i.status) === statusFilter
    );
  }, [list, statusFilter]);

  // ✅ KPI metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalTokens = 0;

    for (const i of list) {
      totalRevenue += i.amount || 0;
      totalTokens += i.tokens || 0;
    }

    return {
      revenue: totalRevenue,
      tokens: totalTokens,
      transactions: list.length,
    };
  }, [list]);

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-white text-[30px] font-bold font-manrope">
            Token Sales
          </h1>
          <p className="text-[#8E94A4] text-[14px] mt-1">
            Monitor token purchases and revenue performance.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white text-sm hover:bg-white/5"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Revenue */}
        <div className="rounded-2xl bg-[#251a34] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center gap-3 text-[#8E94A4]">
            <Wallet className="w-5 h-5" />
            <span className="text-sm">Total Revenue</span>
          </div>
          <p className="mt-3 text-white text-2xl font-bold">
            {formatCurrency(metrics.revenue)}
          </p>
        </div>

        {/* Tokens */}
        <div className="rounded-2xl bg-[#251a34] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center gap-3 text-[#8E94A4]">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Tokens Sold</span>
          </div>
          <p className="mt-3 text-white text-2xl font-bold">
            {metrics.tokens.toLocaleString()}
          </p>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl bg-[#251a34] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center gap-3 text-[#8E94A4]">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Transactions</span>
          </div>
          <p className="mt-3 text-white text-2xl font-bold">
            {metrics.transactions}
          </p>
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="mb-4 flex items-center gap-3">
        <Filter className="w-4 h-4 text-[#8E94A4]" />

        {(["all", "success", "pending", "failed"] as StatusFilter[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                "px-3 py-1 rounded-full text-sm border",
                statusFilter === s
                  ? "bg-white text-black"
                  : "border-white/10 text-white hover:bg-white/5"
              )}
            >
              {s}
            </button>
          )
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-2xl bg-[#251a34] border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-white text-sm">
              <th className="p-4 text-left">Customer</th>
              <th>Tokens</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && <TableSkeleton rows={6} columns={5} />}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <p className="text-white font-semibold">
                    No token sales found
                  </p>
                  <p className="text-[#8E94A4] text-sm mt-1">
                    Try refreshing or adjusting filters
                  </p>
                </td>
              </tr>
            )}

            {/* Rows */}
            {!loading &&
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 text-white">
                    {r.customerName || "—"}
                  </td>
                  <td className="text-white">
                    {r.tokens?.toLocaleString()}
                  </td>
                  <td className="text-white">
                    {formatCurrency(r.amount)}
                  </td>
                  <td>
                    <StatusPill status={r.status} />
                  </td>
                  <td className="text-[#8E94A4]">
                    {formatDate(r.createdAt)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between mt-5">
        <p className="text-xs text-[#8E94A4]">
          Showing {filtered.length} results
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
            setPrevStack((s) => [...s, cursor!]);
            setCursor(nextCursor);
          }}
        />
      </div>
    </div>
  );
}