import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth/api";
import { authStorage } from "@/lib/store/auth";

import type {
  LoginRequest,
  LoginResponse,
} from "@/lib/types/auth/types";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: ["auth", "login"],

    mutationFn: async (credentials) => {
      const response = await authApi.login(credentials);

      if (!response.data) {
        throw new Error("Login response did not contain user data.");
      }

      return response;
    },

    onSuccess: (response) => {
      if (response.data) {
        authStorage.setSession(response.data);
      }
    },
  });
}