/**
 * Remote Care API Client
 *
 * Responsibilities:
 * - API base URL
 * - Authentication headers
 * - Request execution
 * - Response parsing
 * - API error normalization
 * - Session cleanup on unauthorized responses
 */

import { authStorage } from "@/lib/store/auth";

/* -------------------------------------------------------------------------- */
/*                               CONFIGURATION                                */
/* -------------------------------------------------------------------------- */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface ApiResponse<T = unknown> {
  status: string;
  statusCode: number;
  message: string;
  data: T | null;
}

/* -------------------------------------------------------------------------- */
/*                                 API ERROR                                  */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(
    message: string,
    statusCode: number,
    data: unknown = null
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/* -------------------------------------------------------------------------- */
/*                              RESPONSE PARSER                               */
/* -------------------------------------------------------------------------- */

async function parseResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const statusCode = response.status;

  let json: any = null;

  try {
    json = await response.json();
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
      statusCode
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.log("API Response:", json);
  }

  const message =
    typeof json?.message === "string"
      ? json.message
      : Array.isArray(json?.message)
        ? json.message.join(", ")
        : "Something went wrong.";

  const result: ApiResponse<T> = {
    status:
      typeof json?.status === "string"
        ? json.status
        : response.ok
          ? "success"
          : "error",

    statusCode:
      typeof json?.statusCode === "number"
        ? json.statusCode
        : statusCode,

    message,

    data: json?.data ?? null,
  };

  if (!response.ok) {
    throw new ApiError(
      result.message,
      result.statusCode,
      result.data
    );
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                              MAIN API REQUEST                              */
/* -------------------------------------------------------------------------- */

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = authStorage.getToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  if (process.env.NODE_ENV === "development") {
    console.log("API Request:", {
      url,
      method: options.method ?? "GET",
      body: options.body,
    });
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    /**
     * The token is no longer valid.
     *
     * Clear the local session here, but don't perform
     * navigation from the API layer.
     */
    if (response.status === 401) {
      authStorage.clearSession();
    }

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error
        ? error.message
        : "Unable to connect to the server.",
      0
    );
  }
}