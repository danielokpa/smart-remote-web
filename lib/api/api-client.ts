/**
 * Remote Care API Client
 *
 * Responsibilities:
 * - API base URL
 * - Authentication headers
 * - Request execution
 * - Response parsing
 * - API error normalization
 * - Scoped session cleanup on unauthorized responses
 */

import { authStorage } from "@/lib/store/auth";

import type { AuthScope } from "@/lib/types/auth/types";

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface ApiResponse<T = unknown> {
  status: string;
  statusCode: number;
  message: string;
  data: T | null;
}

export interface ApiRequestOptions extends RequestInit {
  /**
   * Determines which authentication session/token
   * should be used for this request.
   */
  authScope?: AuthScope;
}

/* -------------------------------------------------------------------------- */
/* API ERROR                                                                  */
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
/* RESPONSE PARSER                                                            */
/* -------------------------------------------------------------------------- */

async function parseResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const statusCode = response.status;

  let json: unknown = null;

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

  /* ------------------------------------------------------------------------ */
  /* Safely extract response fields                                           */
  /* ------------------------------------------------------------------------ */

  const responseObject =
    typeof json === "object" &&
    json !== null
      ? (json as Record<string, unknown>)
      : {};

  /* ------------------------------------------------------------------------ */
  /* Message                                                                  */
  /* ------------------------------------------------------------------------ */

  const rawMessage = responseObject.message;

  const message =
    typeof rawMessage === "string"
      ? rawMessage
      : Array.isArray(rawMessage)
        ? rawMessage.join(", ")
        : "Something went wrong.";

  /* ------------------------------------------------------------------------ */
  /* Status                                                                   */
  /* ------------------------------------------------------------------------ */

  const responseStatus =
    responseObject.status;

  /* ------------------------------------------------------------------------ */
  /* Status code                                                              */
  /* ------------------------------------------------------------------------ */

  const responseStatusCode =
    responseObject.statusCode;

  /* ------------------------------------------------------------------------ */
  /* Data                                                                     */
  /* ------------------------------------------------------------------------ */

  /**
   * The generic T represents the shape the caller expects.
   *
   * TypeScript cannot determine the runtime shape of JSON data,
   * so we narrow it to T here.
   */
  const responseData =
    responseObject.data as T | null | undefined;

  /* ------------------------------------------------------------------------ */
  /* Normalized response                                                      */
  /* ------------------------------------------------------------------------ */

  const result: ApiResponse<T> = {
    status:
      typeof responseStatus === "string"
        ? responseStatus
        : response.ok
          ? "success"
          : "error",

    statusCode:
      typeof responseStatusCode === "number"
        ? responseStatusCode
        : statusCode,

    message,

    data:
      responseData ?? null,
  };

  /* ------------------------------------------------------------------------ */
  /* Normalize API errors                                                     */
  /* ------------------------------------------------------------------------ */

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
/* MAIN API REQUEST                                                           */
/* -------------------------------------------------------------------------- */

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  /**
   * Extract authScope so it is NOT passed to fetch().
   *
   * Everything else belongs to RequestInit.
   */
  const {
    authScope = "STAFF",
    headers: providedHeaders,
    ...requestOptions
  } = options;

  /* ------------------------------------------------------------------------ */
  /* Authentication                                                           */
  /* ------------------------------------------------------------------------ */

  const token =
    authStorage.getToken(authScope);

  /* ------------------------------------------------------------------------ */
  /* Headers                                                                  */
  /* ------------------------------------------------------------------------ */

  const headers = new Headers(
    providedHeaders
  );

  /**
   * Only set JSON content type when a body exists.
   */
  if (requestOptions.body) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  /* ------------------------------------------------------------------------ */
  /* URL                                                                      */
  /* ------------------------------------------------------------------------ */

  const url =
    `${API_BASE_URL}${endpoint}`;

  if (process.env.NODE_ENV === "development") {
    console.log("API Request:", {
      url,
      method:
        requestOptions.method ?? "GET",
      authScope,
      hasToken: Boolean(token),
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Request                                                                  */
  /* ------------------------------------------------------------------------ */

  try {
    const response = await fetch(url, {
      ...requestOptions,
      headers,
    });

    /* ---------------------------------------------------------------------- */
    /* Scoped unauthorized handling                                           */
    /* ---------------------------------------------------------------------- */

    /**
     * IMPORTANT:
     *
     * Only clear the session whose token was actually
     * used for this request.
     *
     * Example:
     *
     * STAFF request -> STAFF session gets cleared
     * PATIENT request -> PATIENT session gets cleared
     */
    if (response.status === 401) {
      authStorage.clearSession(authScope);
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

/* -------------------------------------------------------------------------- */
/* STAFF API                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Use this for APIs that require a staff token:
 *
 * ADMIN
 * DOCTOR
 * NURSE
 */
export function staffApiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(
    endpoint,
    {
      ...options,
      authScope: "STAFF",
    }
  );
}

/* -------------------------------------------------------------------------- */
/* PATIENT API                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Use this for APIs that require a patient token.
 */
export function patientApiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(
    endpoint,
    {
      ...options,
      authScope: "PATIENT",
    }
  );
}

export function scopedApiRequest<T = unknown>(
  authScope: AuthScope,
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(
    endpoint,
    {
      ...options,
      authScope,
    }
  );
}