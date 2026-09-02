"use client";

import { authStorage } from "@/lib/store/auth";
import type { UserType } from "@/lib/types/auth/types";

import {
  DASHBOARD_UI_CONFIG,
} from "@/lib/config/dashboard/dashboard-ui.config";

export function useRemoteCareUI() {
  const user = authStorage.getUser();

  const userRole = user?.userType as UserType | undefined;

  /**
   * During the initial client render there may not
   * be a stored user yet. ADMIN is only a safe fallback
   * for rendering the configuration; authorization must
   * still be enforced by the backend.
   */
  const role: UserType = userRole ?? "ADMIN";

  const config = DASHBOARD_UI_CONFIG[role];

  return {
    ...config,
    role,
    user,
  };
}