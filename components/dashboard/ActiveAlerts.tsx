"use client";

import {
  AlertTriangle,
  ArrowRight,
  HeartPulse,
  Thermometer,
} from "lucide-react";

import Link from "next/link";

import type { Alert } from "@/lib/types/alerts/types";

interface ActiveAlertsProps {
  alerts: Alert[];
  loading?: boolean;
}

function getParameterInfo(parameter: string) {
  const normalized = parameter.toLowerCase();

  if (
    normalized.includes("heart") ||
    normalized.includes("pulse")
  ) {
    return {
      label: "Heart rate",
      icon: HeartPulse,
    };
  }

  if (normalized.includes("temperature")) {
    return {
      label: "Temperature",
      icon: Thermometer,
    };
  }

  return {
    label: parameter.replace(/_/g, " "),
    icon: AlertTriangle,
  };
}

export default function ActiveAlerts({
  alerts,
  loading,
}: ActiveAlertsProps) {
  return (
    <div className="rounded-[24px] border border-[#DCE7EE] bg-white p-6 shadow-[0_8px_30px_rgba(15,41,66,0.05)]">

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDEEEE]">
              <AlertTriangle className="h-4 w-4 text-[#DC4C4C]" />
            </div>

            <div>
              <h2 className="font-manrope text-[16px] font-bold text-[#0F2942]">
                Active alerts
              </h2>

              <p className="font-manrope text-[11px] text-[#91A0AA]">
                Threshold breaches requiring attention
              </p>
            </div>
          </div>
        </div>

        <span className="rounded-full border border-[#F5D7D7] bg-[#FEF5F5] px-3 py-1 text-[10px] font-bold text-[#C34A4A]">
          {loading ? "…" : alerts.length}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[74px] animate-pulse rounded-2xl bg-[#F3F7F9]"
            />
          ))
        ) : alerts.length === 0 ? (
          <div className="rounded-2xl border border-[#DCEFE9] bg-[#F4FBF8] p-6 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#E2F5ED]">
              <span className="text-[15px] text-[#15916C]">
                ✓
              </span>
            </div>

            <p className="mt-3 font-manrope text-[12px] font-semibold text-[#346B59]">
              No active alerts
            </p>

            <p className="mt-1 font-manrope text-[10px] text-[#7D9A90]">
              All monitored thresholds are currently clear.
            </p>
          </div>
        ) : (
          alerts.slice(0, 5).map((alert) => {
            const info = getParameterInfo(
              alert.parameter
            );

            const Icon = info.icon;

            return (
              <div
                key={alert.id}
                className="group rounded-2xl border border-[#F0DCDC] bg-[#FFF9F9] p-4 transition-colors hover:border-[#E9C7C7]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDEEEE]">
                    <Icon className="h-4 w-4 text-[#DC4C4C]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-manrope text-[12px] font-bold capitalize text-[#3E515E]">
                        {info.label}
                      </p>

                      <span className="shrink-0 font-manrope text-[13px] font-bold text-[#C34A4A]">
                        {alert.value}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="truncate font-manrope text-[10px] text-[#91A0AA]">
                        Patient:{" "}
                        {alert.patient?.name ??
                          alert.patientId.slice(0, 8)}
                      </p>

                      <p className="shrink-0 font-manrope text-[9px] text-[#A7B1B7]">
                        {new Date(
                          alert.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {alerts.length > 0 && (
        <Link
          href="/alerts"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#DCE7EE] py-2.5 font-manrope text-[11px] font-bold text-[#526A79] transition-colors hover:bg-[#F5F9FB] hover:text-[#1677A8]"
        >
          View all alerts

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}