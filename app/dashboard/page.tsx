"use client";

import {
  AlertTriangle,
  Cpu,
  HeartPulse,
  Users,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import MonitoringOverview from "@/components/dashboard/MonitoringOverview";
import ActiveAlerts from "@/components/dashboard/ActiveAlerts";
import RecentReadings from "@/components/dashboard/RecentReadings";

import { useDashboard } from "@/lib/hooks/dashboard/useDashboard";
import { useAuth } from "@/lib/hooks/auth/useAuth";

export default function DashboardPage() {
  const {
    patients,
    devices,
    readings,
    activeAlerts,
    isLoading,
    isError,
    error,
  } = useDashboard();

  const { user } = useAuth();

  const activeDevices = devices.filter(
    (device) => device.status === "ACTIVE"
  );

  return (
    <div className="w-full">

      <DashboardHeader
        userName={
          user?.email
            ? user.email.split("@")[0]
            : "there"
        }
        userType={user?.userType}
      />

      {isError && (
        <div className="mb-6 rounded-2xl border border-[#F0D2D2] bg-[#FFF7F7] px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FDEEEE]">
              <AlertTriangle className="h-3.5 w-3.5 text-[#DC4C4C]" />
            </div>

            <div>
              <p className="font-manrope text-[12px] font-bold text-[#A63C3C]">
                Unable to load some dashboard data
              </p>

              <p className="mt-0.5 font-manrope text-[10px] text-[#B46A6A]">
                {error instanceof Error
                  ? error.message
                  : "Please refresh the page and try again."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* STATISTICS                                                       */}
      {/* =============================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <DashboardStatCard
          title="Total patients"
          value={
            isLoading
              ? "…"
              : patients.length
          }
          subtitle="Registered patients"
          tone="blue"
          icon={
            <Users className="h-5 w-5" />
          }
        />

        <DashboardStatCard
          title="Active alerts"
          value={
            isLoading
              ? "…"
              : activeAlerts.length
          }
          subtitle={
            activeAlerts.length > 0
              ? "Requires attention"
              : "No active alerts"
          }
          tone={
            activeAlerts.length > 0
              ? "danger"
              : "teal"
          }
          icon={
            <AlertTriangle className="h-5 w-5" />
          }
        />

        <DashboardStatCard
          title="Active devices"
          value={
            isLoading
              ? "…"
              : activeDevices.length
          }
          subtitle={
            isLoading
              ? "Loading device status"
              : `${devices.length} total devices`
          }
          tone="teal"
          icon={
            <Cpu className="h-5 w-5" />
          }
        />

        <DashboardStatCard
          title="Health readings"
          value={
            isLoading
              ? "…"
              : readings.length
          }
          subtitle="Retrieved monitoring data"
          tone="blue"
          icon={
            <HeartPulse className="h-5 w-5" />
          }
        />

      </div>

      {/* =============================================================== */}
      {/* MONITORING + ALERTS                                             */}
      {/* =============================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">

        <MonitoringOverview
          readings={readings}
          loading={isLoading}
        />

        <ActiveAlerts
          alerts={activeAlerts}
          loading={isLoading}
        />

      </div>

      {/* =============================================================== */}
      {/* RECENT READINGS                                                 */}
      {/* =============================================================== */}

      <div className="mt-6">
        <RecentReadings
          readings={readings}
          loading={isLoading}
        />
      </div>

    </div>
  );
}