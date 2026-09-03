"use client";

import {
  Activity,
  ArrowRight,
  HeartPulse,
  Thermometer,
} from "lucide-react";

import Link from "next/link";

import type { DashboardReading } from "@/lib/api/dashboard/api";

interface RecentReadingsProps {
  readings: DashboardReading[];
  loading?: boolean;
}

export default function RecentReadings({
  readings,
  loading,
}: RecentReadingsProps) {
  const recentReadings = [...readings]
    .sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() -
        new Date(a.recordedAt).getTime()
    )
    .slice(0, 7);

  return (
    <div className="rounded-[24px] border border-[#DCE7EE] bg-white p-6 shadow-[0_8px_30px_rgba(15,41,66,0.05)]">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF4F9]">
              <Activity className="h-4 w-4 text-[#1677A8]" />
            </div>

            <div>
              <h2 className="font-manrope text-[16px] font-bold text-[#0F2942]">
                Recent health readings
              </h2>

              <p className="font-manrope text-[11px] text-[#91A0AA]">
                Latest vital-sign data received by the system
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/readings"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1677A8] hover:text-[#126A97]"
        >
          View readings

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            <tr className="border-b border-[#E9EFF2]">
              <th className="px-3 py-3 text-left font-manrope text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A0AA]">
                Patient
              </th>

              <th className="px-3 py-3 text-left font-manrope text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A0AA]">
                Heart rate
              </th>

              <th className="px-3 py-3 text-left font-manrope text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A0AA]">
                Temperature
              </th>

              <th className="px-3 py-3 text-left font-manrope text-[10px] font-bold uppercase tracking-[0.08em] text-[#91A0AA]">
                Recorded
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={4} className="px-3 py-2">
                    <div className="h-12 animate-pulse rounded-xl bg-[#F3F7F9]" />
                  </td>
                </tr>
              ))
            ) : recentReadings.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center"
                >
                  <Activity className="mx-auto h-6 w-6 text-[#A2B0B9]" />

                  <p className="mt-3 font-manrope text-[12px] font-semibold text-[#526A79]">
                    No health readings yet
                  </p>
                </td>
              </tr>
            ) : (
              recentReadings.map((reading) => (
                <tr
                  key={reading.id}
                  className="border-b border-[#F0F3F5] transition-colors hover:bg-[#F9FBFC]"
                >
                  <td className="px-3 py-3.5">
                    <div>
                      <p className="font-manrope text-[12px] font-bold text-[#344D5D]">
                        reading.patient
                          ? `${reading.patient.firstName} ${reading.patient.lastName}`
                          : reading.patientId.slice(0, 8)
                      </p>

                      <p className="mt-0.5 font-manrope text-[9px] text-[#A0ACB3]">
                        ID: {reading.patientId.slice(0, 8)}…
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4F9] px-2.5 py-1 font-manrope text-[10px] font-bold text-[#1677A8]">
                      <HeartPulse className="h-3 w-3" />

                      {reading.heartRate} bpm
                    </span>
                  </td>

                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F6F5] px-2.5 py-1 font-manrope text-[10px] font-bold text-[#168F8A]">
                      <Thermometer className="h-3 w-3" />

                      {reading.temperature} °C
                    </span>
                  </td>

                  <td className="px-3 py-3.5">
                    <p className="font-manrope text-[10px] font-medium text-[#718391]">
                      {new Date(
                        reading.recordedAt
                      ).toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}