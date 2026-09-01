"use client";

import {
  Activity,
  HeartPulse,
  Thermometer,
  TrendingUp,
} from "lucide-react";

import type { HealthReading } from "@/lib/api/readings/types";

interface MonitoringOverviewProps {
  readings: HealthReading[];
  loading?: boolean;
}

function getLatestReading(
  readings: HealthReading[]
) {
  if (!readings.length) return null;

  return [...readings].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() -
      new Date(a.recordedAt).getTime()
  )[0];
}

export default function MonitoringOverview({
  readings,
  loading,
}: MonitoringOverviewProps) {
  const latest = getLatestReading(readings);

  return (
    <div className="rounded-[24px] border border-[#DCE7EE] bg-white p-6 shadow-[0_8px_30px_rgba(15,41,66,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7F6F5]">
              <Activity className="h-4 w-4 text-[#16A6A1]" />
            </div>

            <div>
              <h2 className="font-manrope text-[16px] font-bold text-[#0F2942]">
                Monitoring overview
              </h2>

              <p className="font-manrope text-[11px] text-[#91A0AA]">
                Latest recorded vital signs
              </p>
            </div>
          </div>
        </div>

        <span className="rounded-full border border-[#DCEFE9] bg-[#F0FAF7] px-3 py-1 text-[10px] font-bold text-[#15916C]">
          Live data
        </span>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="h-36 animate-pulse rounded-2xl bg-[#F2F6F8]" />
          <div className="h-36 animate-pulse rounded-2xl bg-[#F2F6F8]" />
        </div>
      ) : !latest ? (
        <div className="mt-6 rounded-2xl bg-[#F6F9FB] p-8 text-center">
          <Activity className="mx-auto h-6 w-6 text-[#A2B0B9]" />

          <p className="mt-3 font-manrope text-[13px] font-semibold text-[#526A79]">
            No readings available
          </p>

          <p className="mt-1 font-manrope text-[11px] text-[#91A0AA]">
            Health readings will appear here once devices begin submitting data.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Heart rate */}
            <div className="rounded-[20px] border border-[#DCE7EE] bg-[#F9FCFD] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF4F9]">
                    <HeartPulse className="h-4 w-4 text-[#1677A8]" />
                  </div>

                  <span className="font-manrope text-[11px] font-semibold text-[#718391]">
                    Heart rate
                  </span>
                </div>

                <TrendingUp className="h-4 w-4 text-[#16A6A1]" />
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-manrope text-[30px] font-bold tracking-[-0.04em] text-[#0F2942]">
                  {latest.heartRate}
                </span>

                <span className="mb-1 font-manrope text-[11px] font-medium text-[#91A0AA]">
                  bpm
                </span>
              </div>

              <p className="mt-2 font-manrope text-[10px] text-[#91A0AA]">
                Latest recorded reading
              </p>
            </div>

            {/* Temperature */}
            <div className="rounded-[20px] border border-[#DCE7EE] bg-[#F9FCFD] p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF4F9]">
                  <Thermometer className="h-4 w-4 text-[#1677A8]" />
                </div>

                <span className="font-manrope text-[11px] font-semibold text-[#718391]">
                  Temperature
                </span>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="font-manrope text-[30px] font-bold tracking-[-0.04em] text-[#0F2942]">
                  {latest.temperature}
                </span>

                <span className="mb-1 font-manrope text-[11px] font-medium text-[#91A0AA]">
                  °C
                </span>
              </div>

              <p className="mt-2 font-manrope text-[10px] text-[#91A0AA]">
                Latest recorded reading
              </p>
            </div>

          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#EDF2F5] pt-4">
            <p className="font-manrope text-[10px] text-[#91A0AA]">
              Last reading
            </p>

            <p className="font-manrope text-[10px] font-semibold text-[#526A79]">
              {new Date(
                latest.recordedAt
              ).toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}