"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { authStorage } from "@/lib/store/auth";

import type {
  AuthScope,
  UserType,
} from "@/lib/types/auth/types";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface ProtectedRouteProps {
  children: React.ReactNode;

  /**
   * Determines which authentication session
   * this route belongs to.
   */
  authScope: AuthScope;

  /**
   * Optional additional role restriction.
   *
   * Example:
   * STAFF scope + ADMIN only.
   */
  allowedUserTypes?: UserType[];

  /**
   * Where to send the user when authentication fails.
   */
  loginPath?: string;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function ProtectedRoute({
  children,
  authScope,
  allowedUserTypes,
  loginPath = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    /*
     * Get ONLY the session associated
     * with this protected route.
     */
    const token =
      authStorage.getToken(
        authScope
      );

    const user =
      authStorage.getUser(
        authScope
      );

    /* -------------------------------------------------------------------- */
    /* NO SESSION                                                           */
    /* -------------------------------------------------------------------- */

    if (!token || !user) {
      setAuthenticated(false);
      setChecking(false);

      router.replace(
        `${loginPath}?redirect=${encodeURIComponent(
          pathname
        )}`
      );

      return;
    }

    /* -------------------------------------------------------------------- */
    /* ROLE CHECK                                                            */
    /* -------------------------------------------------------------------- */

    if (
      allowedUserTypes &&
      allowedUserTypes.length > 0 &&
      !allowedUserTypes.includes(
        user.userType
      )
    ) {
      setAuthenticated(false);
      setChecking(false);

      /*
       * User has a valid session, but
       * the session does not have permission
       * for this route.
       */
      router.replace(
        loginPath
      );

      return;
    }

    /* -------------------------------------------------------------------- */
    /* VALID SESSION                                                        */
    /* -------------------------------------------------------------------- */

    setAuthenticated(true);
    setChecking(false);
  }, [
    authScope,
    allowedUserTypes,
    loginPath,
    pathname,
    router,
  ]);

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (checking) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#071A17]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#2DD4BF]" />

          <p className="font-manrope text-sm text-[#8FA8A2]">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* UNAUTHORIZED                                                           */
  /* ---------------------------------------------------------------------- */

  if (!authenticated) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* AUTHORIZED                                                             */
  /* ---------------------------------------------------------------------- */

  return <>{children}</>;
}