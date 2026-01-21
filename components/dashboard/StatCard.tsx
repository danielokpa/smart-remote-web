"use client";

import clsx from "clsx";

export default function StatCard({
  title,
  value,
  subtitle,
  tone = "neutral",
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: "neutral" | "success" | "warning";
  icon?: React.ReactNode;
}) {
  const toneStyles =
    tone === "success"
      ? "bg-green-500/10 border-green-500/20"
      : tone === "warning"
      ? "bg-yellow-500/10 border-yellow-500/20"
      : "bg-white/5 border-white/10";

  return (
    <div
      className={clsx(
        "rounded-2xl border p-5 shadow-2xl",
        "bg-[#251a34]",
        toneStyles
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-manrope text-[13px] text-[#8E94A4]">{title}</p>
          <p className="font-manrope font-bold text-[28px] text-white mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="font-manrope text-[12px] text-white/50 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-[#2d1f3f] border border-white/10 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
