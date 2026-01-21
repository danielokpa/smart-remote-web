"use client";

import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import TodayConversions from "@/components/dashboard/TodayConversions";
import { cngStationApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, ClipboardList } from "lucide-react";

type Conversion = {
  id: string;
  status: string;
  createdAt?: string;
};

export default function DashboardHomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [todayItems, setTodayItems] = useState<Conversion[]>([]);
  const [allItems, setAllItems] = useState<Conversion[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ adjust this to the correct station endpoint when available
        const res = await cngStationApi.getConversions(1, 30);

        if (!mounted) return;

        if (res.success && res.data) {
          const items = (res.data.data || []) as Conversion[];
          setAllItems(items);

          const today = new Date();
          const isSameDay = (d: Date) =>
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate();

          setTodayItems(
            items.filter((x) => (x.createdAt ? isSameDay(new Date(x.createdAt)) : false))
          );
        } else {
          setError(res.message || "Failed to load dashboard data.");
        }
      } catch {
        if (!mounted) return;
        setError("An error occurred while loading dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = allItems.length;

    const approved = allItems.filter((c) =>
      (c.status || "").toLowerCase().includes("approved")
    ).length;

    const pending = allItems.filter((c) =>
      (c.status || "").toLowerCase().includes("pending")
    ).length;

    return { total, approved, pending };
  }, [allItems]);

  return (
    <div className="w-full">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-manrope font-bold text-[28px] md:text-[34px] leading-tight text-white">
            Home Overview
          </h1>
          <p className="font-manrope text-[#8E94A4] text-[14px] md:text-[15px] mt-1">
            Track conversion flow and manage today’s workload.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl p-4 bg-red-500/15 border border-red-500/30">
          <p className="font-manrope font-medium text-[14px] text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Top section: stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Requests (loaded)"
          value={loading ? "…" : stats.total}
          subtitle="Recent sample from your station"
          icon={<ClipboardList className="w-5 h-5 text-white" />}
        />
        <StatCard
          title="Approved"
          value={loading ? "…" : stats.approved}
          tone="success"
          subtitle="Completed successfully"
          icon={<CheckCircle2 className="w-5 h-5 text-green-300" />}
        />
        <StatCard
          title="Pending"
          value={loading ? "…" : stats.pending}
          tone="warning"
          subtitle="Awaiting action"
          icon={<AlertTriangle className="w-5 h-5 text-yellow-300" />}
        />
      </div>

      {/* Middle section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <QuickActionCard
            title="Quick Actions"
            description="Open conversions and update station details without digging through menus."
            href="/dashboard/conversions"
            cta="View Conversions"
          />

          <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 shadow-2xl">
            <p className="font-manrope font-bold text-white text-[18px]">
              Operational Tips
            </p>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li className="font-manrope text-[#8E94A4]">
                • Keep station status active during business hours.
              </li>
              <li className="font-manrope text-[#8E94A4]">
                • Review pending requests twice daily.
              </li>
              <li className="font-manrope text-[#8E94A4]">
                • Ensure safety certifications are up to date.
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <TodayConversions items={todayItems} loading={loading} />
        </div>
      </div>

      {/* Bottom: Recent activity */}
      <div className="mt-6 rounded-2xl bg-[#251a34] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-manrope font-bold text-white text-[18px]">
              Recent Activity
            </p>
            <p className="font-manrope text-[#8E94A4] text-[13px] mt-1">
              A quick look at your latest conversion requests
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard/conversions")}
            className="px-4 py-2 rounded-full border border-white/10 text-white font-manrope font-semibold text-[14px] hover:bg-white/5 transition"
          >
            Open list
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-3 text-left font-manrope font-semibold text-[13px] text-white">
                  ID
                </th>
                <th className="py-3 px-3 text-left font-manrope font-semibold text-[13px] text-white">
                  Status
                </th>
                <th className="py-3 px-3 text-left font-manrope font-semibold text-[13px] text-white">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {(loading ? [] : allItems.slice(0, 6)).map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-3 px-3 font-manrope font-medium text-[13px] text-white">
                    {c.id.slice(0, 8)}…
                  </td>
                  <td className="py-3 px-3 font-manrope text-[13px] text-[#8E94A4]">
                    {c.status || "N/A"}
                  </td>
                  <td className="py-3 px-3 font-manrope text-[13px] text-[#8E94A4]">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}

              {!loading && allItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-10 text-center">
                    <p className="font-manrope text-[#8E94A4]">
                      No conversions available yet.
                    </p>
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={3} className="py-10 text-center">
                    <p className="font-manrope text-[#8E94A4]">Loading dashboard…</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
