/**
 * API utility for handling authenticated requests
 * Handles Bearer token from localStorage for @ApiBearerAuth guards
 */

import { LoginType } from "@/enums/login-type.enum";
// API base URL - defaults to empty string for Next.js API routes
// Set NEXT_PUBLIC_API_URL environment variable for external API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/pepp-stations" || '';



// Product key for API requests
// Set NEXT_PUBLIC_PRODUCT_KEY environment variable
const PRODUCT_KEY = process.env.NEXT_PUBLIC_PRODUCT_KEY || '';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
};

/**
 * Get user type to local storage
 */
export const getStationLoginType = (): LoginType | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("station_login_type") as LoginType ?? null;
}

/**
 * Set user type from local storage
 */
export const setStationLoginType = (userType: LoginType): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem("station_login_type", userType);
}

/**
 * Remove user type from local storage
 */
export const removeStationLoginType = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem("station_login_type");
}

/**
 * Handle ResponseUtil.handleResponse wrapper format
 * Parses the response from NestJS backend
 */
const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type');
  
  if (!contentType?.includes('application/json')) {
    return {
      success: false,
      message: 'Invalid response format',
      statusCode: response.status,
    };
  }

  const json = await response.json();
  
  // Log the full response for debugging
  console.log('API Response Body:', json);
  
  // Handle ResponseUtil.handleResponse format
  // Expected format: { success: boolean, message: string, data?: T }
  if (json.success !== undefined) {
    return json as ApiResponse<T>;
  }
  
  // Handle validation errors (422) - NestJS validation errors
  if (response.status === 422 && json.message) {
    // If message is an array (validation errors), join them
    const errorMessage = Array.isArray(json.message) 
      ? json.message.join(', ') 
      : json.message;
    
    return {
      success: false,
      message: errorMessage || 'Validation failed',
      data: json,
      statusCode: response.status,
    };
  }
  
  // Fallback: if response is already in expected format or different structure
  return {
    success: response.ok,
    message: json.message || json.error || (response.ok ? 'Request completed' : 'Request failed'),
    data: json.data || json,
    statusCode: response.status,
  };
};

/**
 * Make authenticated API request
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add x-product-key header if configured
  // if (PRODUCT_KEY) {
  //   headers['x-product-key'] = PRODUCT_KEY;
  // }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
    console.log('API Request:', {
      baseUrl: API_BASE_URL,
      endpoint,
      fullUrl: url,
      method: options.method || 'GET',
      headers: Object.keys(headers),
      body: options.body ? JSON.parse(options.body as string) : undefined,
    });
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    const result = await parseResponse<T>(response);

    // If unauthorized, remove token
    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
      statusCode: 0,
    };
  }
};

/**
 * Auth API endpoints
 */
export const authApi = {
  login: (identity: string, userType: LoginType) =>
    apiRequest<{ email: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identity, userType }),
    }),

  loginWithOtp: (identity: string, otp: string, deviceInfo: string, userType: LoginType) =>
    apiRequest<{ token: string; user: any }>("/auth/login-with-otp", {
      method: "POST",
      body: JSON.stringify({ identity, otp, deviceInfo, userType }),
    }),
};

/**
 * CNG Station API endpoints
 */
export const cngStationApi = {
  getConversions: (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return apiRequest<{
      data: any[];
      total: number;
      currentPage: number;
      totalPages: number;
    }>(`/cng-station/cng-conversions?${params}`);
  },

  // ✅ NEW
  // getProfile: () =>
  //   apiRequest("/cng-station/profile", {
  //     method: "GET",
  //   }),


  getConversionById: (id: string) =>
    apiRequest(`/cng-station/conversion/${id}`, { method: "GET" }),
};

export const stationSettingsApi = {
  requestUpdate: () => {
    const stationType = getStationLoginType();

    switch(stationType) {
      case LoginType.CNG_STATION:
        return apiRequest('/cng-fueling-stations/update', {
          method: "POST",
        });
        
      case LoginType.CNG_CONVERSION_STATION:
        return apiRequest('/cng-station/update', {
          method: "POST",
        });
        
      case LoginType.EV_CHARGING_STATION:
        return apiRequest('/charging-stations/update', {
          method: "POST",
        });

      default:
        return Promise.resolve({
          success: false,
          message: "Missing station login type. Please login again",
          statusCode: 400,
        })
    }
  },

  updateWithOtp: (otp: string, updateData: any) => {
    const stationType = getStationLoginType();
    switch (stationType) {
      case LoginType.CNG_STATION:
        return apiRequest("/cng-fueling-station/update-otp", {
          method: "PATCH",
          body: JSON.stringify({ otp, updateData }),
        });
      case LoginType.CNG_CONVERSION_STATION:
        return apiRequest("/cng-station/update-otp", {
          method: "PATCH",
          body: JSON.stringify({ otp, updateData }),
        });

      case LoginType.EV_CHARGING_STATION:
        return apiRequest("/charging-stations/update-otp", {
          method: "PATCH",
          body: JSON.stringify({ otp, updateData }),
        });

      default:
        return Promise.resolve<ApiResponse<any>>({
          success: false,
          message: "Missing station login type. Please login again.",
          statusCode: 400,
          data: undefined,
        });
    }
  },
}

export const stationProfileApi = {
  getProfile: () => {
    const stationType = getStationLoginType();

    // ✅ pick endpoint based on station type
    switch (stationType) {
      case LoginType.CNG_STATION:
        return apiRequest("/cng-fueling-stations/profile", { method: "GET" });

      case LoginType.CNG_CONVERSION_STATION:
        return apiRequest("/cng-station/profile", { method: "GET" });

      case LoginType.EV_CHARGING_STATION:
        return apiRequest("/charging-stations/profile", { method: "GET" });

      default:
        return Promise.resolve<ApiResponse<any>>({
          success: false,
          message: "Missing station login type. Please login again.",
          statusCode: 400,
          data: undefined,
        });
    }
  },
};
