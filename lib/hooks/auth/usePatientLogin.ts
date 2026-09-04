"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/auth/api";
import { authStorage } from "@/lib/store/auth";

import type {
  PatientLoginRequest,
  PatientLoginResponse,
} from "@/lib/types/auth/types";

export function usePatientLogin() {
  const router = useRouter();

  return useMutation<
    PatientLoginResponse,
    Error,
    PatientLoginRequest
  >({
    mutationKey: ["auth", "patient-login"],

    mutationFn: async (credentials) => {
      const response = await authApi.patientLogin(credentials);

      if (!response.data) {
        throw new Error(
          "Patient login response did not contain user data."
        );
      }

      return response;
    },

    onSuccess: (response) => {
      if (!response.data) return;

      const patient = response.data;

      authStorage.setSession({
        id: patient.id,
        token: patient.token,
        userType: "PATIENT",
        userId: patient.id,
        email: patient.patient!.email!,
        patient: patient.patient,
      });

      router.replace("/dashboard");
    },
  });
}