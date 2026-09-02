"use client";

import {
  Activity,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userType?: string;
}

export default function DashboardHeader({
  userName = "there",
  userType,
}: DashboardHeaderProps) {
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const roleLabel = userType
    ? userType.charAt(0) +
      userType.slice(1).toLowerCase()
    : null;

  return (
    <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      {/* Heading */}
      <div className="min-w-0">
        {/* Status */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/15 bg-[#0E2723] px-3 py-1.5">
          <Activity className="h-3.5 w-3.5 text-[#2DD4BF]" />

          <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-[#8FA8A2]">
            Remote monitoring
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
        </div>

        {/* Greeting */}
        <h1 className="font-manrope text-[28px] font-bold tracking-[-0.03em] text-white md:text-[34px]">
          Good day, {userName}
        </h1>

        <p className="mt-1.5 max-w-2xl font-manrope text-[13px] leading-6 text-[#8FA8A2] md:text-[14px]">
          Here's an overview of your patient monitoring system
          and today's activity.
        </p>

        {/* Role */}
        {roleLabel && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />

            <span className="font-manrope text-[12px] font-medium text-[#A8BCB7]">
              Signed in as
            </span>

            <span className="font-manrope text-[12px] font-bold text-white">
              {roleLabel}
            </span>
          </div>
        )}
      </div>

      {/* Date */}
      <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-[#0E2723] px-4 py-2.5">
        <CalendarDays className="h-4 w-4 text-[#2DD4BF]" />

        <span className="font-manrope text-[11px] font-semibold text-[#8FA8A2]">
          {date}
        </span>
      </div>
    </div>
  );
}