"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { setAuthToken, setStationLoginType } from "@/lib/api/api-client";
import { authApi } from "@/lib/api/auth/api";
import { LoginType } from "@/enums/login-type.enum";

const LOGIN_TYPE_LABEL: Record<LoginType, string> = {
  CNG_STATION: "CNG Station",
  CNG_CONVERSION_STATION: "CNG Conversion Station",
  EV_CHARGING_STATION: "EV Charging Station",
};

function buildDeviceInfo() {
  if (typeof window === "undefined") return "Web";
  const ua = navigator.userAgent || "Web";
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || "";
  // keep it short (your DTO has MaxLength(50))
  const info = `${platform ? platform + " - " : ""}${ua}`;
  return info.slice(0, 50);
}

export default function VerifyOtpPage() {
  const [identity, setIdentity] = useState("");
  const [userType, setUserType] = useState<LoginType | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const userTypeLabel = useMemo(() => {
    if (!userType) return "";
    return LOGIN_TYPE_LABEL[userType];
  }, [userType]);
  

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pendingIdentity = sessionStorage.getItem("pending_identity");
    const pendingUserType = sessionStorage.getItem("pending_userType") as LoginType | null;

    if (!pendingIdentity || !pendingUserType) {
      router.push("/login");
      return;
    }

    setIdentity(pendingIdentity);
    setUserType(pendingUserType);

  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!identity || !userType) {
      setError("Missing login details. Please go back and try again.");
      return;
    }

    setLoading(true);

    try {
      const deviceInfo = buildDeviceInfo();

      const response = await authApi.loginWithOtp(
        identity.trim(),
        otp,
        deviceInfo,
        userType
      );

      if (response.success && response.data?.token) {
        setAuthToken(response.data.token);
        setStationLoginType(userType);

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pending_identity");
          sessionStorage.removeItem("pending_userType");
        }

        // Redirect (adjust per userType if you want different dashboards)
        router.push("/dashboard");
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verify exception:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pending_identity");
      sessionStorage.removeItem("pending_userType");
    }
    router.push("/login");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#11021f] text-white flex items-center justify-center px-4">
      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(118,47,184,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(0,255,231,0.15),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/images/navbar-logo.png"
            alt="PEPPCruise logo"
            width={40}
            height={36}
            className="object-contain"
          />
          <span className="font-manrope font-bold text-[24px] leading-[150%] text-white">
            PEPP Cruise
          </span>
        </div>

        {/* Verify OTP Card */}
        <div className="relative rounded-2xl bg-[#251a34] border border-white/10 backdrop-blur-md p-8 md:p-10 shadow-2xl">
          {/* Gradient overlay */}
          <div
            className="absolute w-[60%] aspect-square top-16 right-0 opacity-50 rounded-full blur-[100px] z-0"
            style={{
              background:
                "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-manrope font-bold text-[32px] md:text-[40px] leading-tight text-white">
                Verify OTP
              </h1>

              {userTypeLabel && (
                <span className="shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[12px] font-manrope font-semibold bg-white/5 border border-white/10 text-white/90">
                  {userTypeLabel}
                </span>
              )}
            </div>

            <p className="font-manrope font-medium text-[15px] md:text-[16px] leading-relaxed text-[#8E94A4] mb-2">
              Enter the 6-digit code sent to
            </p>
            <p className="font-manrope font-semibold text-[15px] md:text-[16px] text-white mb-8 break-all">
              {identity}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="otp"
                  className="font-manrope font-semibold text-[14px] text-white"
                >
                  OTP Code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                  }}
                  required
                  maxLength={6}
                  className="w-full rounded-full p-4 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[20px] text-center tracking-widest outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                />
              </div>

              {error && (
                <div className="rounded-2xl p-4 bg-red-500/15 border border-red-500/30">
                  <p className="font-manrope font-medium text-[14px] text-red-300 text-center">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-full p-4 bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] text-white font-manrope font-bold text-[16px] hover:from-[#8A3AC7] hover:to-[#AB5DF0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full rounded-full p-4 border border-white/20 text-white font-manrope font-semibold text-[14px] hover:bg-white/10 transition-all"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 font-manrope font-normal text-[13px] text-[#8E94A4]">
          © 2025 PEPP Cruise. All rights reserved.
        </p>
      </div>
    </main>
  );
}
