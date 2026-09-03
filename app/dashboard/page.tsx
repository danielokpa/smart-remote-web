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
    metrics,
    readings,
    activeAlerts,
    isLoading,
    isError,
    error,
  } = useDashboard();

  const { user } = useAuth();

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

      {/* ================================================================
          ERROR STATE
      ================================================================ */}

      {isError && (
        <div className="mb-6 rounded-2xl border border-red-400/10 bg-red-400/5 px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-400/10">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            </div>

            <div>
              <p className="font-manrope text-[12px] font-bold text-red-300">
                Unable to load dashboard data
              </p>

              <p className="mt-0.5 font-manrope text-[10px] text-red-300/70">
                {error instanceof Error
                  ? error.message
                  : "Please refresh the page and try again."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          STATISTICS
      ================================================================ */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total patients"
          value={
            isLoading
              ? "…"
              : metrics.totalPatients
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
              : metrics.activeAlerts
          }
          subtitle={
            !isLoading && metrics.activeAlerts > 0
              ? "Requires attention"
              : "No active alerts"
          }
          tone={
            !isLoading && metrics.activeAlerts > 0
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
              : metrics.activeDevices
          }
          subtitle="Currently monitoring patients"
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
              : metrics.healthReadings
          }
          subtitle="Recorded health readings"
          tone="blue"
          icon={
            <HeartPulse className="h-5 w-5" />
          }
        />
      </div>

      {/* ================================================================
          MONITORING + ACTIVE ALERTS
      ================================================================ */}

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

      {/* ================================================================
          RECENT READINGS
      ================================================================ */}

      <div className="mt-6">
        <RecentReadings
          readings={readings}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
