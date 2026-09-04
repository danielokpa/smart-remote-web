import {
  apiRequest,
} from "@/lib/api/api-client";

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  PatientLoginRequest,
  PatientLoginResponse,
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
  patientLogin: async (payload: PatientLoginRequest): Promise<PatientLoginResponse> => {
    const response = await apiRequest<PatientLoginResponse["data"]>(
      "/auth/patient", 
      {
        method: "POST",
        body: JSON.stringify(payload),
      });

    return {
      status: response.status,
      statusCode: response.statusCode,
      message: response.message,
      data: response.data!,
    };
  },
};
