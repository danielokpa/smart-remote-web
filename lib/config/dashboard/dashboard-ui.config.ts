import {
  Activity,
  Bell,
  CalendarDays,
  ClipboardList,
  Cpu,
  LayoutDashboard,
  Settings,
  Stethoscope,
  UserCircle2,
  Users,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { UserType } from "@/lib/types/auth/types";

export interface DashboardNavItem {
  label: string;
  href: string;
  description?: string;
  icon: LucideIcon;
}

export interface DashboardUIConfig {
  label: string;

  header: {
    title: string;
    subtitle: string;
  };

  title: string;
  description: string;

  stats: {
    showPatients: boolean;
    showDoctors: boolean;
    showNurses: boolean;
    showAlerts: boolean;
  };

  quickActions: Array<{
    key: string;
    title: string;
    description: string;
    href: string;
  }>;

  navItems: DashboardNavItem[];
}

export const DASHBOARD_UI_CONFIG: Record<
  UserType,
  DashboardUIConfig
> = {
  /* -------------------------------------------------------------------------- */
  /* ADMIN                                                                      */
  /* -------------------------------------------------------------------------- */

  ADMIN: {
    label: "Administration",

    header: {
      title: "Remote Care",
      subtitle: "Healthcare operations",
    },

    title: "Dashboard Overview",

    description:
      "Monitor remote healthcare operations and manage your organization.",

    stats: {
      showPatients: true,
      showDoctors: true,
      showNurses: true,
      showAlerts: true,
    },

    quickActions: [
      {
        key: "patients",
        title: "Manage Patients",
        description:
          "View and manage registered patients.",
        href: "/dashboard/patients",
      },
      {
        key: "users",
        title: "Manage Staff",
        description:
          "Manage doctors and nurses.",
        href: "/dashboard/users",
      },
    ],

    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        description: "Overview and activity",
        icon: LayoutDashboard,
      },
      {
        label: "Patients",
        href: "/dashboard/patients",
        description: "Patient records",
        icon: Users,
      },
      {
        label: "Staff",
        href: "/dashboard/users",
        description: "Doctors and nurses",
        icon: Stethoscope,
      },
      {
        label: "Alerts",
        href: "/dashboard/alerts",
        description: "Health alerts",
        icon: Bell,
      },
      {
        label: "Reports",
        href: "/dashboard/reports",
        description: "Healthcare reports",
        icon: ClipboardList,
      },
      {
        label: "Devices",
        href: "/dashboard/devices",
        description: "Monitoring devices",
        icon: Cpu,
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        description: "System settings",
        icon: Settings,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* DOCTOR                                                                     */
  /* -------------------------------------------------------------------------- */

  DOCTOR: {
    label: "Clinical Care",

    header: {
      title: "Remote Care",
      subtitle: "Clinical monitoring",
    },

    title: "Clinical Overview",

    description:
      "Monitor your patients and review their latest health information.",

    stats: {
      showPatients: true,
      showDoctors: false,
      showNurses: false,
      showAlerts: true,
    },

    quickActions: [
      {
        key: "patients",
        title: "My Patients",
        description:
          "Review patients assigned to your care.",
        href: "/dashboard/patients",
      },
      {
        key: "monitoring",
        title: "Patient Monitoring",
        description:
          "Review current patient health data.",
        href: "/dashboard/monitoring",
      },
    ],

    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        description: "Clinical overview",
        icon: LayoutDashboard,
      },
      {
        label: "My Patients",
        href: "/dashboard/patients",
        description: "Patients under your care",
        icon: Users,
      },
      {
        label: "Monitoring",
        href: "/dashboard/monitoring",
        description: "Patient health data",
        icon: Activity,
      },
      {
        label: "Appointments",
        href: "/dashboard/appointments",
        description: "Upcoming appointments",
        icon: CalendarDays,
      },
      {
        label: "Alerts",
        href: "/dashboard/alerts",
        description: "Patient health alerts",
        icon: Bell,
      },
      {
        label: "Profile",
        href: "/dashboard/profile",
        description: "Your professional profile",
        icon: UserCircle2,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* NURSE                                                                      */
  /* -------------------------------------------------------------------------- */

  NURSE: {
    label: "Nursing Care",

    header: {
      title: "Remote Care",
      subtitle: "Patient care monitoring",
    },

    title: "Care Overview",

    description:
      "Monitor assigned patients and keep track of important care activities.",

    stats: {
      showPatients: true,
      showDoctors: false,
      showNurses: false,
      showAlerts: true,
    },

    quickActions: [
      {
        key: "patients",
        title: "Assigned Patients",
        description:
          "View and monitor your assigned patients.",
        href: "/dashboard/patients",
      },
      {
        key: "monitoring",
        title: "Patient Monitoring",
        description:
          "Review current patient health information.",
        href: "/dashboard/monitoring",
      },
    ],

    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        description: "Care overview",
        icon: LayoutDashboard,
      },
      {
        label: "My Patients",
        href: "/dashboard/patients",
        description: "Assigned patients",
        icon: Users,
      },
      {
        label: "Monitoring",
        href: "/dashboard/monitoring",
        description: "Patient health data",
        icon: Activity,
      },
      {
        label: "Appointments",
        href: "/dashboard/appointments",
        description: "Care appointments",
        icon: CalendarDays,
      },
      {
        label: "Alerts",
        href: "/dashboard/alerts",
        description: "Patient health alerts",
        icon: Bell,
      },
      {
        label: "Profile",
        href: "/dashboard/profile",
        description: "Your professional profile",
        icon: UserCircle2,
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* PATIENT                                                                     */
  /* -------------------------------------------------------------------------- */

  PATIENT: {
    label: "Patient Portal",

    header: {
      title: "Remote Care",
      subtitle: "Personal health monitoring",
    },

    title: "My Health",

    description:
      "View your latest health information, monitoring updates, and alerts.",

    stats: {
      showPatients: false,
      showDoctors: false,
      showNurses: false,
      showAlerts: true,
    },

    quickActions: [
      {
        key: "monitoring",
        title: "Health Monitoring",
        description:
          "View your latest health readings and monitoring data.",
        href: "/dashboard/monitoring",
      },
      {
        key: "alerts",
        title: "Health Alerts",
        description:
          "Review important alerts related to your health.",
        href: "/dashboard/alerts",
      },
    ],

    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        description: "Your health overview",
        icon: LayoutDashboard,
      },
      {
        label: "My Health",
        href: "/dashboard/monitoring",
        description: "Your health readings",
        icon: Activity,
      },
      {
        label: "Appointments",
        href: "/dashboard/appointments",
        description: "Your appointments",
        icon: CalendarDays,
      },
      {
        label: "Alerts",
        href: "/dashboard/alerts",
        description: "Your health alerts",
        icon: Bell,
      },
      {
        label: "Profile",
        href: "/dashboard/profile",
        description: "Your patient profile",
        icon: UserCircle2,
      },
    ],
  },
};