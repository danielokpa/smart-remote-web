import {
  apiRequest,
} from "@/lib/api/api-client";

import type {
  LoginRequest,
  LoginResponse,
} from "../../types/auth/types";

export const authApi = {
  login: async (
    credentials: LoginRequest
  ): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse["data"]>(
      "/auth",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    return {
      status: response.status,
      statusCode: response.statusCode,
      message: response.message,
      data: response.data!,
    };
  },
};