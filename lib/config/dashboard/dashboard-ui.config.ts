import type { UserRole } from "@/lib/types/auth/user.type";

export interface DashboardUIConfig {
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

  navigation: Array<{
    label: string;
    href: string;
  }>;
}

export const DASHBOARD_UI_CONFIG: Record<UserRole, DashboardUIConfig> = {
  ADMIN: {
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
        description: "View and manage registered patients.",
        href: "/dashboard/patients",
      },
      {
        key: "users",
        title: "Manage Staff",
        description: "Manage doctors and nurses.",
        href: "/dashboard/users",
      },
    ],

    navigation: [
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Patients",
        href: "/dashboard/patients",
      },
      {
        label: "Staff",
        href: "/dashboard/users",
      },
    ],
  },

  DOCTOR: {
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
        description: "Review patients assigned to your care.",
        href: "/dashboard/patients",
      },
    ],

    navigation: [
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "My Patients",
        href: "/dashboard/patients",
      },
    ],
  },

  NURSE: {
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
        description: "View and monitor your assigned patients.",
        href: "/dashboard/patients",
      },
    ],

    navigation: [
      {
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        label: "Patients",
        href: "/dashboard/patients",
      },
    ],
  },
};