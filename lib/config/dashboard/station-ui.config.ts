import { Home, Car, Settings, UserCircle2, Wallet, Zap } from "lucide-react";
import type { StationType, StationUIConfig } from "@/lib/types/station.type";

export const STATION_UI_CONFIG: Record<StationType, StationUIConfig> = {
  CNG_CONVERSION_STATION: {
    label: "CNG Conversion Admin",
    header: {
      title: "Dashboard",
      subtitle: "Overview • conversions • operations",
    },
    navItems: [
      { href: "/dashboard", label: "Home", icon: Home, description: "Overview & insights" },
      { href: "/dashboard/conversions", label: "Conversions", icon: Car, description: "View Conversion requests" },
      { href: "/dashboard/tokens", label: "Account", icon: Wallet, description: "My account" },
      { href: "/dashboard/settings", label: "Settings", icon: Settings, description: "Station Settings" },
      { href: "/dashboard/profile", label: "Profile", icon: UserCircle2, description: "Your Profile" },
    ],
    labels: {
      conversions: "Conversions",
      todayTitle: "Today’s Conversions",
      quickActionTitle: "Quick Actions",
      quickActionCta: "View Conversions",
      emptyState: "No conversions today",
    },
    routes: {
      primary: "/dashboard/conversions",
    },
  },

  EV_CHARGING_STATION: {
    label: "EV Charging Admin",
    header: {
      title: "Dashboard",
      subtitle: "Overview • charging • operations",
    },
    navItems: [
      { href: "/dashboard", label: "Home", icon: Home, description: "Overview & insights", },
      { href: "/dashboard/charging-requests", label: "Charging Requests", icon: Zap, description: "View Charging sessions", },
      { href: "/dashboard/tokens", label: "Account", icon: Wallet, description: "My account", },
      { href: "/dashboard/settings", label: "Settings", icon: Settings, description: "Station Settings", },
      { href: "/dashboard/profile", label: "Profile", icon: UserCircle2, description: "Your Profile", },
    ],
    labels: {
      conversions: "Charging Sessions",
      todayTitle: "Today’s Charging Sessions",
      quickActionTitle: "Quick Actions",
      quickActionCta: "View Charging History",
      emptyState: "No charging sessions today",
    },
    routes: {
      primary: "/dashboard/charging-requests",
    },
  },

  CNG_STATION: {
    label: "CNG Fueling Admin",
    header: {
      title: "Dashboard",
      subtitle: "Overview • fueling • operations",
    },
    navItems: [
      { href: "/dashboard", label: "Home", icon: Home, description: "Overview & insights", },
      { href: "/dashboard/fueling-requests", label: "Fueling Logs", icon: Car, description: "View Fueling Logs", },
      { href: "/dashboard/tokens", label: "Account", icon: Wallet, description: "My account", },
      { href: "/dashboard/settings", label: "Settings", icon: Settings, description: "Station Settings", },
      { href: "/dashboard/profile", label: "Profile", icon: UserCircle2, description: "Your Profile", },
    ],
    labels: {
      conversions: "Fueling Records",
      todayTitle: "Today’s Fueling",
      quickActionTitle: "Quick Actions",
      quickActionCta: "View Fueling Logs",
      emptyState: "No fueling records today",
    },
    routes: {
      primary: "/dashboard/fueling-requests",
    },
  },
};