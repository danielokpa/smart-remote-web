"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authApi } from "@/lib/api";
import { LoginType } from "@/enums/login-type.enum";
import clsx from "clsx";

const LOGIN_TYPES: Array<{
  value: LoginType;
  title: string;
  description: string;
}> = [
  {
    value: LoginType.CNG_STATION,
    title: "CNG Station",
    description: "Fueling station operator access",
  },
  {
    value: LoginType.CNG_CONVERSION_STATION,
    title: "CNG Conversion Station",
    description: "Conversion center dashboard access",
  },
  {
    value: LoginType.EV_CHARGING_STATION,
    title: "EV Charging Station",
    description: "Charging station operator access",
  },
];

export default function LoginPage() {
  const [identity, setIdentity] = useState("");
  const [userType, setUserType] = useState<LoginType>(LoginType.CNG_STATION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.trim());
  }, [identity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login(identity.trim(), userType);

      if (response.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("pending_identity", identity.trim());
          sessionStorage.setItem("pending_userType", userType);
        }
        router.push("/verify-otp");
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#11021f] text-white"
    >
      {/* Background effects (kept INSIDE main, but cannot create page overflow) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(118,47,184,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(0,255,231,0.15),transparent_40%)]" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 px-4 pt-10 pb-10 md:pt-14">
        <div className="mx-auto w-full max-w-[760px]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Image
              src="/images/navbar-logo.png"
              alt="PEPPCruise logo"
              width={40}
              height={36}
              className="object-contain"
              priority
            />
            <span className="font-manrope font-bold text-[24px] leading-[150%] text-white">
              PEPP Cruise
            </span>
          </div>

          {/* Login Card */}
          <div className="relative rounded-2xl bg-[#251a34] border border-white/10 backdrop-blur-md p-6 sm:p-8 md:p-10 shadow-2xl">
            {/* Glow (clipped so it won't cause overflow) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div
                className="absolute w-[520px] h-[520px] -top-24 -right-32 opacity-50 rounded-full blur-[110px]"
                style={{
                  background:
                    "radial-gradient(45.33% 45.33% at 50% 50%, #8A25E9 0%, rgba(117,31,198,0.656447) 38.28%, rgba(78,21,131,0) 100%)",
                }}
              />
            </div>

            <div className="relative z-10">
              <h1 className="font-manrope font-bold text-[30px] md:text-[40px] leading-tight text-white mb-2">
                Station Login
              </h1>

              <p className="font-manrope font-medium text-[15px] md:text-[16px] leading-relaxed text-[#8E94A4] mb-6">
                Choose your station type and enter your email to receive a passcode
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Station type selector (stacked for ALL sizes) */}
                <div className="flex flex-col gap-2">
                  <label className="font-manrope font-semibold text-[14px] text-white">
                    Station type
                  </label>

                  <div className="rounded-2xl bg-[#2d1f3f] border border-white/10 p-2">
                    <div className="flex flex-col gap-2">
                      {LOGIN_TYPES.map((t) => {
                        const active = t.value === userType;

                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setUserType(t.value)}
                            className={clsx(
                              "text-left rounded-xl px-4 py-3 transition-all border",
                              "flex items-center justify-between gap-3",
                              active
                                ? "bg-gradient-to-r from-[#762FB8]/40 to-[#9B4DE0]/30 border-[#762FB8]/40 shadow-[0_0_0_1px_rgba(118,47,184,0.25)]"
                                : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                            )}
                          >
                            <div className="min-w-0">
                              <p className="font-manrope font-bold text-[14px] text-white leading-snug">
                                {t.title}
                              </p>
                              <p className="font-manrope font-medium text-[12px] text-[#8E94A4] leading-snug mt-1">
                                {t.description}
                              </p>
                            </div>

                            {/* radio dot */}
                            <span
                              className={clsx(
                                "shrink-0 w-5 h-5 rounded-full border flex items-center justify-center",
                                active ? "border-[#9B4DE0]" : "border-white/20"
                              )}
                            >
                              <span
                                className={clsx(
                                  "w-2.5 h-2.5 rounded-full transition-all",
                                  active ? "bg-[#9B4DE0]" : "bg-transparent"
                                )}
                              />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="identity"
                    className="font-manrope font-semibold text-[14px] text-white"
                  >
                    Email address
                  </label>

                  <input
                    id="identity"
                    type="email"
                    placeholder="station@example.com"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    required
                    className="w-full rounded-full p-4 bg-[#2d1f3f] border border-white/10 text-white placeholder:text-[#8E94A4] font-manrope text-[14px] outline-none focus:border-[#762FB8] focus:ring-2 focus:ring-[#762FB8]/20 transition-all"
                  />

                  {!isValidEmail && identity.length > 0 && (
                    <p className="font-manrope text-[12px] text-red-300/90">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-2xl p-4 bg-red-500/15 border border-red-500/30">
                    <p className="font-manrope font-medium text-[14px] text-red-300 text-center">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isValidEmail}
                  className="w-full rounded-full p-4 bg-gradient-to-r from-[#762FB8] to-[#9B4DE0] text-white font-manrope font-bold text-[16px] hover:from-[#8A3AC7] hover:to-[#AB5DF0] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? "Sending..." : "Send Passcode"}
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 font-manrope font-normal text-[13px] text-[#8E94A4]">
            © 2025 PEPP Cruise. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
