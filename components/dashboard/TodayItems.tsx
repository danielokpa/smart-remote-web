"use client";

import clsx from "clsx";
import type { DashboardItem } from "@/lib/types/dashboardItem.type";

type StatusMap = Record<string, string>;

export default function TodayItems({
  items,
  loading,
  title,
  description,
  emptyText,
  statusMap,
  formatDate,
}: {
  items: DashboardItem[];
  loading?: boolean;
  title: string;
  description?: string;
  emptyText: string;
  statusMap?: StatusMap;
  formatDate?: (date: string) => string;
}) {
  const getStatusStyle = (status: string) => {
    const key = (status || "").toLowerCase();

    if (statusMap && statusMap[key]) return statusMap[key];

    // fallback
    if (key.includes("approved"))
      return "bg-green-500/15 border-green-500/30 text-green-300";
    if (key.includes("pending"))
      return "bg-yellow-500/15 border-yellow-500/30 text-yellow-300";
    if (key.includes("rejected"))
      return "bg-red-500/15 border-red-500/30 text-red-300";

    return "bg-white/5 border-white/10 text-[#8E94A4]";
  };

  return (
    <div className="rounded-2xl bg-[#251a34] border border-white/10 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-manrope font-bold text-white text-[18px]">
            {title}
          </p>
          {description && (
            <p className="font-manrope text-[#8E94A4] text-[13px] mt-1">
              {description}
            </p>
          )}
        </div>

        <span className="px-3 py-1 rounded-full text-[12px] font-manrope font-semibold bg-white/5 border border-white/10 text-white/80">
          {loading ? "…" : `${items.length} total`}
        </span>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-8 text-center">
            <p className="font-manrope font-semibold text-white/80">
              {emptyText}
            </p>
            <p className="font-manrope text-[#8E94A4] text-[13px] mt-1">
              New activity will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-[#2d1f3f] border border-white/10 px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-manrope font-semibold text-white text-[14px] truncate">
                    #{c.id.slice(0, 8)}
                  </p>
                  <p className="font-manrope text-[#8E94A4] text-[12px] mt-1 truncate">
                    {c.createdAt
                      ? formatDate
                        ? formatDate(c.createdAt)
                        : new Date(c.createdAt).toLocaleString()
                      : "—"}
                  </p>
                </div>

                <span
                  className={clsx(
                    "shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[12px] font-manrope font-semibold border",
                    getStatusStyle(c.status)
                  )}
                >
                  {c.status || "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}