"use client";

import clsx from "clsx";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  tone?: "blue" | "teal" | "warning" | "danger";
}

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  icon,
  tone = "blue",
}: DashboardStatCardProps) {
  const styles = {
    blue: {
      icon: "bg-[#EAF4F9] text-[#1677A8]",
      value: "text-[#0F2942]",
    },

    teal: {
      icon: "bg-[#E7F6F5] text-[#16A6A1]",
      value: "text-[#0F2942]",
    },

    warning: {
      icon: "bg-[#FFF7E7] text-[#C48A1A]",
      value: "text-[#0F2942]",
    },

    danger: {
      icon: "bg-[#FDEEEE] text-[#DC4C4C]",
      value: "text-[#0F2942]",
    },
  };

  const style = styles[tone];

  return (
    <div className="rounded-[22px] border border-[#DCE7EE] bg-white p-5 shadow-[0_8px_30px_rgba(15,41,66,0.05)] transition-shadow hover:shadow-[0_12px_35px_rgba(15,41,66,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-manrope text-[12px] font-semibold text-[#718391]">
            {title}
          </p>

          <p
            className={clsx(
              "mt-2 font-manrope text-[30px] font-bold tracking-[-0.035em]",
              style.value
            )}
          >
            {value}
          </p>

          <p className="mt-1 font-manrope text-[11px] text-[#93A1AA]">
            {subtitle}
          </p>
        </div>

        <div
          className={clsx(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            style.icon
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}