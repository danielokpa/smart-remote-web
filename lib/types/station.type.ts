import type { NavItem } from "@/lib/types/nav-item.type";
export type StationType = "CNG_STATION" | "CNG_CONVERSION_STATION" | "EV_CHARGING_STATION";

export type StationUIConfig = {
  label: string; // e.g. "CNG Conversion Admin"
  header: {
    title: string;
    subtitle: string;
  };
  navItems: NavItem[];
  labels: {
    conversions: string; // dynamic naming
    todayTitle: string;
    quickActionTitle: string;
    quickActionCta: string;
    emptyState: string;
  };
  routes: {
    primary: string;
  };
};