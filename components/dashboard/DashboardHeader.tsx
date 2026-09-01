"use client";

import {
  Activity,
  CalendarDays,
} from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userType?: string;
}

export default function DashboardHeader({
  userName = "there",
  userType,
}: DashboardHeaderProps) {
  const date = new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date());

  return (
    <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCE7EE] bg-white px-3 py-1.5">
          <Activity className="h-3.5 w-3.5 text-[#16A6A1]" />

          <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.14em] text-[#718391]">
            Remote monitoring
          </span>
        </div>

        <h1 className="font-manrope text-[28px] font-bold tracking-[-0.03em] text-[#0F2942] md:text-[34px]">
          Good day, {userName}
        </h1>

        <p className="mt-1.5 font-manrope text-[13px] leading-6 text-[#718391] md:text-[14px]">
          Here's an overview of your patient monitoring system
          {userType
            ? ` as ${userType.toLowerCase()}.`
            : "."}
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#DCE7EE] bg-white px-4 py-2.5 shadow-sm">
        <CalendarDays className="h-4 w-4 text-[#1677A8]" />

        <span className="font-manrope text-[11px] font-semibold text-[#526A79]">
          {date}
        </span>
      </div>
    </div>
  );
}