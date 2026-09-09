"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authStorage } from "@/lib/store/auth";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(() =>
    authStorage.getUser("STAFF")
  );

  useEffect(() => {
    setUser(
      authStorage.getUser("STAFF")
    );
  }, []);

  const logout = () => {
    authStorage.clearSession("STAFF");

    router.replace("/");
  };

  return {
    user,

    isAuthenticated:
      Boolean(user?.token),

    logout,
  };
}