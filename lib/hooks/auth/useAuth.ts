"use client";

import { useEffect, useState } from "react";

import { authStorage } from "@/lib/store/auth";

export function useAuth() {
  const [user, setUser] =
    useState(() => authStorage.getUser());

  useEffect(() => {
    setUser(authStorage.getUser());
  }, []);

  const logout = () => {
    authStorage.clearSession();

    window.location.href = "/login";
  };

  return {
    user,
    isAuthenticated: Boolean(user?.token),
    logout,
  };
}