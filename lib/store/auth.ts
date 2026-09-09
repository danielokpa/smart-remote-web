import type {
  AuthScope,
  AuthUser,
  UserType,
} from "@/lib/types/auth/types";

/* -------------------------------------------------------------------------- */
/* STORAGE KEYS                                                               */
/* -------------------------------------------------------------------------- */

const AUTH_KEYS: Record<
  AuthScope,
  {
    token: string;
    user: string;
  }
> = {
  STAFF: {
    token: "remote_care_staff_auth_token",
    user: "remote_care_staff_auth_user",
  },

  PATIENT: {
    token: "remote_care_patient_auth_token",
    user: "remote_care_patient_auth_user",
  },
};

/* -------------------------------------------------------------------------- */
/* LEGACY KEYS                                                                */
/* -------------------------------------------------------------------------- */

/**
 * These were used before staff and patient sessions
 * were separated.
 *
 * Remove them once so an old session cannot interfere
 * with the new authentication model.
 */
const LEGACY_AUTH_KEYS = [
  "remote_care_auth_token",
  "remote_care_auth_user",
] as const;

/* -------------------------------------------------------------------------- */
/* BROWSER CHECK                                                              */
/* -------------------------------------------------------------------------- */

const isBrowser =
  typeof window !== "undefined";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getKeys(
  scope: AuthScope
) {
  return AUTH_KEYS[scope];
}

function getScopeFromUserType(
  userType: UserType
): AuthScope {
  return userType === "PATIENT"
    ? "PATIENT"
    : "STAFF";
}

function removeLegacyAuth(): void {
  if (!isBrowser) return;

  for (const key of LEGACY_AUTH_KEYS) {
    localStorage.removeItem(key);
  }
}

/* -------------------------------------------------------------------------- */
/* CLEAN LEGACY STORAGE                                                       */
/* -------------------------------------------------------------------------- */

if (isBrowser) {
  removeLegacyAuth();
}

/* -------------------------------------------------------------------------- */
/* AUTH STORAGE                                                               */
/* -------------------------------------------------------------------------- */

export const authStorage = {
  /* ---------------------------------------------------------------------- */
  /* TOKEN                                                                  */
  /* ---------------------------------------------------------------------- */

  getToken(
    scope: AuthScope
  ): string | null {
    if (!isBrowser) return null;

    return localStorage.getItem(
      getKeys(scope).token
    );
  },

  setToken(
    scope: AuthScope,
    token: string
  ): void {
    if (!isBrowser) return;

    localStorage.setItem(
      getKeys(scope).token,
      token
    );
  },

  removeToken(
    scope: AuthScope
  ): void {
    if (!isBrowser) return;

    localStorage.removeItem(
      getKeys(scope).token
    );
  },

  /* ---------------------------------------------------------------------- */
  /* USER                                                                   */
  /* ---------------------------------------------------------------------- */

  getUser(
    scope: AuthScope
  ): AuthUser | null {
    if (!isBrowser) return null;

    const storedUser =
      localStorage.getItem(
        getKeys(scope).user
      );

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(
        storedUser
      ) as AuthUser;
    } catch {
      return null;
    }
  },

  setUser(
    scope: AuthScope,
    user: AuthUser
  ): void {
    if (!isBrowser) return;

    localStorage.setItem(
      getKeys(scope).user,
      JSON.stringify(user)
    );
  },

  getUserType(
    scope: AuthScope
  ): UserType | null {
    return (
      this.getUser(scope)
        ?.userType ?? null
    );
  },

  removeUser(
    scope: AuthScope
  ): void {
    if (!isBrowser) return;

    localStorage.removeItem(
      getKeys(scope).user
    );
  },

  /* ---------------------------------------------------------------------- */
  /* SESSION                                                                */
  /* ---------------------------------------------------------------------- */

  setSession(
    scope: AuthScope,
    user: AuthUser
  ): void {
    this.setToken(
      scope,
      user.token
    );

    this.setUser(
      scope,
      user
    );
  },

  clearSession(
    scope: AuthScope
  ): void {
    this.removeToken(scope);
    this.removeUser(scope);
  },

  /* ---------------------------------------------------------------------- */
  /* AUTH CHECK                                                             */
  /* ---------------------------------------------------------------------- */

  isAuthenticated(
    scope: AuthScope
  ): boolean {
    return Boolean(
      this.getToken(scope)
    );
  },

  /* ---------------------------------------------------------------------- */
  /* USER TYPE                                                               */
  /* ---------------------------------------------------------------------- */

  getScopeFromUserType,

  /* ---------------------------------------------------------------------- */
  /* CONVENIENCE METHODS                                                     */
  /* ---------------------------------------------------------------------- */

  getStaffToken(): string | null {
    return this.getToken("STAFF");
  },

  getStaffUser(): AuthUser | null {
    return this.getUser("STAFF");
  },

  getPatientToken(): string | null {
    return this.getToken("PATIENT");
  },

  getPatientUser(): AuthUser | null {
    return this.getUser("PATIENT");
  },

  clearStaffSession(): void {
    this.clearSession("STAFF");
  },

  clearPatientSession(): void {
    this.clearSession("PATIENT");
  },

  /* ---------------------------------------------------------------------- */
  /* CLEAR ALL                                                               */
  /* ---------------------------------------------------------------------- */

  clearAllSessions(): void {
    this.clearSession("STAFF");
    this.clearSession("PATIENT");
  },
};