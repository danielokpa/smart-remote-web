"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown } from "lucide-react";

type StatusFilter = "all" | "approved" | "pending" | "rejected";

const OPTIONS: {
  value: StatusFilter;
  label: string;
  icon?: React.ReactNode;
}[] = [
  { value: "all", label: "All statuses" },
  {
    value: "approved",
    label: "Approved",
    icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  },
  {
    value: "pending",
    label: "Pending",
    icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: <XCircle className="w-4 h-4 text-red-400" />,
  },
];

export function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-2xl",
          "bg-[#251a34] border border-white/10",
          "hover:bg-white/5 transition",
          "font-manrope text-[14px] text-white"
        )}
      >
        {current?.icon}
        <span>{current?.label}</span>
        <ChevronDown
          className={clsx(
            "w-4 h-4 text-[#8E94A4] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={clsx(
            "absolute right-0 mt-2 w-48 z-50",
            "rounded-2xl bg-[#1b1028] border border-white/10",
            "shadow-2xl overflow-hidden"
          )}
        >
          {OPTIONS.map((opt) => {
            const active = opt.value === value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 text-left",
                  "font-manrope text-[14px] transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-[#8E94A4] hover:bg-white/5 hover:text-white"
                )}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
