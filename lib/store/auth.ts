import type { AuthUser } from "@/lib/types/auth/types";

const AUTH_TOKEN_KEY = "remote_care_auth_token";
const AUTH_USER_KEY = "remote_care_auth_user";

const isBrowser = typeof window !== "undefined";

export const authStorage = {
  /* ---------------------------------------------------------------------- */
  /* TOKEN                                                                  */
  /* ---------------------------------------------------------------------- */

  getToken(): string | null {
    if (!isBrowser) return null;

    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    if (!isBrowser) return;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  removeToken(): void {
    if (!isBrowser) return;

    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  /* ---------------------------------------------------------------------- */
  /* USER                                                                   */
  /* ---------------------------------------------------------------------- */

  getUser(): AuthUser | null {
    if (!isBrowser) return null;

    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser): void {
    if (!isBrowser) return;

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  getUserType(): AuthUser["userType"] | null {
    return this.getUser()?.userType ?? null;
  },

  removeUser(): void {
    if (!isBrowser) return;

    localStorage.removeItem(AUTH_USER_KEY);
  },

  /* ---------------------------------------------------------------------- */
  /* SESSION                                                                */
  /* ---------------------------------------------------------------------- */

  setSession(user: AuthUser): void {
    this.setToken(user.token);
    this.setUser(user);
  },

  clearSession(): void {
    this.removeToken();
    this.removeUser();
  },

  /* ---------------------------------------------------------------------- */
  /* AUTH CHECK                                                             */
  /* ---------------------------------------------------------------------- */

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};