"use client";

import { useEffect, useState } from "react";

import { authStorage } from "@/lib/store/auth";

import type {
  AuthScope,
  AuthUser,
  UserType,
} from "@/lib/types/auth/types";

import {
  DASHBOARD_UI_CONFIG,
} from "@/lib/config/dashboard/dashboard-ui.config";

export function useRemoteCareUI(
  authScope: AuthScope
) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const storedUser =
      authStorage.getUser(authScope);

    setUser(storedUser);
    setIsLoading(false);
  }, [authScope]);

  const role = user?.userType as
    | UserType
    | undefined;

  const config = role
    ? DASHBOARD_UI_CONFIG[role]
    : null;

  return {
    user,
    role,
    config,
    isLoading,
  };
}