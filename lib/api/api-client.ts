/**
 * API Client
 * Handles:
 * - Auth token
 * - Base URL
 * - Request/response parsing
 * - Error normalization
 */

import { LoginType } from "@/enums/login-type.enum";

/* -------------------------------------------------------------------------- */
/*                               CONFIGURATION                                */
/* -------------------------------------------------------------------------- */

// ✅ FIXED: avoids "undefined/pepp-stations"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/pepp-stations`
  : "";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
}

/* -------------------------------------------------------------------------- */
/*                            LOCAL STORAGE HELPERS                           */
/* -------------------------------------------------------------------------- */

const isBrowser = typeof window !== "undefined";

export const getAuthToken = (): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem("auth_token");
};

export const setAuthToken = (token: string): void => {
  if (!isBrowser) return;
  localStorage.setItem("auth_token", token);
};

export const removeAuthToken = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem("auth_token");
};

export const getStationLoginType = (): LoginType | null => {
  if (!isBrowser) return null;
  return (localStorage.getItem("station_login_type") as LoginType) ?? null;
};

export const setStationLoginType = (type: LoginType): void => {
  if (!isBrowser) return;
  localStorage.setItem("station_login_type", type);
};

export const removeStationLoginType = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem("station_login_type");
};

/* -------------------------------------------------------------------------- */
/*                              RESPONSE PARSER                               */
/* -------------------------------------------------------------------------- */

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const statusCode = response.status;

  let json: any = null;

  try {
    json = await response.json();
  } catch {
    return {
      success: false,
      message: "Invalid JSON response",
      data: null,
      statusCode,
    };
  }

  // ✅ Dev-only logging
  if (process.env.NODE_ENV === "development") {
    console.log("API Response:", json);
  }

  /**
   * Expected backend format:
   * { success: boolean, message: string, data?: T }
   */
  if (typeof json.success === "boolean") {
    return {
      success: json.success,
      message: json.message || "",
      data: json.data ?? null,
      statusCode,
    };
  }

  /**
   * Handle validation errors (422)
   */
  if (statusCode === 422 && json?.message) {
    const message = Array.isArray(json.message)
      ? json.message.join(", ")
      : json.message;

    return {
      success: false,
      message,
      data: null,
      statusCode,
    };
  }

  /**
   * Fallback (non-standard response)
   */
  return {
    success: response.ok,
    message:
      json?.message ||
      json?.error ||
      (response.ok ? "Request successful" : "Request failed"),
    data: json?.data ?? json ?? null,
    statusCode,
  };
};

/* -------------------------------------------------------------------------- */
/*                              MAIN API REQUEST                              */
/* -------------------------------------------------------------------------- */

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;

  // ✅ Dev-only request logging
  if (process.env.NODE_ENV === "development") {
    console.log("API Request:", {
      url,
      method: options.method || "GET",
      body: options.body,
    });
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 🔐 Handle unauthorized globally
    if (response.status === 401) {
      removeAuthToken();

      if (isBrowser) {
        window.location.href = "/login";
      }
    }

    return await parseResponse<T>(response);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Network error occurred",
      data: null,
      statusCode: 0,
    };
  }
};