"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  Wifi,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useLogin } from "@/lib/hooks/auth/useLogin";

function getLoginErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sign you in. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();

  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const passwordIsValid = password.length > 0;

  const formIsValid =
    emailIsValid &&
    passwordIsValid;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);

    if (!formIsValid) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
      });

      router.replace("/dashboard");
    } catch {
      // React Query exposes the error through loginMutation.error.
      // No additional handling is necessary here.
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F8FB] text-[#172B3A]">
      <div className="relative min-h-screen overflow-hidden">

        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#16A6A1]/[0.07] blur-3xl" />

          <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-[#1677A8]/[0.07] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center px-5 py-8 sm:px-8 lg:px-12">

          <div className="mx-auto grid w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-[#DCE7EE] bg-white shadow-[0_24px_80px_rgba(15,41,66,0.10)] lg:grid-cols-[1.02fr_0.98fr]">

            {/* ========================================================= */}
            {/* LEFT — BRAND / HEALTH MONITORING VISUAL                  */}
            {/* ========================================================= */}

            <section className="relative hidden min-h-[700px] overflow-hidden bg-[#0F2942] p-10 text-white lg:flex lg:flex-col">

              {/* Background decoration */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-[-100px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[#16A6A1]/20 blur-[90px]" />

                <div className="absolute bottom-[-150px] left-[-120px] h-[420px] w-[420px] rounded-full bg-[#1677A8]/20 blur-[100px]" />

                <div
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "38px 38px",
                  }}
                />
              </div>

              <div className="relative z-10 flex h-full flex-col">

                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A6A1] shadow-lg shadow-[#16A6A1]/20">
                    <HeartPulse className="h-6 w-6" strokeWidth={2.2} />
                  </div>

                  <div>
                    <p className="font-manrope text-[20px] font-bold tracking-[-0.02em]">
                      RemoteCare
                    </p>

                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                      Smart Health Monitoring
                    </p>
                  </div>
                </div>

                {/* Hero copy */}
                <div className="mt-auto">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[12px] font-medium text-white/75 backdrop-blur">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ED6AE] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ED6AE]" />
                    </span>

                    Remote monitoring system
                  </div>

                  <h1 className="max-w-[500px] font-manrope text-[42px] font-bold leading-[1.08] tracking-[-0.035em]">
                    Keep every patient
                    <span className="text-[#58D1C6]">
                      {" "}within reach.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-white/60">
                    Monitor vital signs, identify threshold
                    breaches and respond to patient alerts from
                    one secure workspace.
                  </p>

                  {/* Monitoring card */}
                  <div className="mt-9 max-w-[500px] rounded-[22px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-md">

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
                          Live monitoring
                        </p>

                        <p className="mt-1 text-[15px] font-semibold text-white">
                          Patient vitals
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16A6A1]/15">
                        <Activity className="h-4.5 w-4.5 text-[#58D1C6]" />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      {/* Heart rate */}
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div className="flex items-center gap-2">
                          <HeartPulse className="h-4 w-4 text-[#58D1C6]" />

                          <span className="text-[11px] text-white/45">
                            Heart rate
                          </span>
                        </div>

                        <div className="mt-3 flex items-end gap-1.5">
                          <span className="text-[25px] font-bold">
                            78
                          </span>

                          <span className="mb-1 text-[11px] text-white/40">
                            bpm
                          </span>
                        </div>

                        <div className="mt-3 flex items-end gap-[3px]">
                          {[18, 28, 22, 35, 27, 42, 32, 38, 29, 45, 36, 41].map(
                            (height, index) => (
                              <span
                                key={index}
                                className="w-[3px] rounded-full bg-[#58D1C6]/60"
                                style={{ height }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* Temperature */}
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-[#70B8E0]" />

                          <span className="text-[11px] text-white/45">
                            Temperature
                          </span>
                        </div>

                        <div className="mt-3 flex items-end gap-1.5">
                          <span className="text-[25px] font-bold">
                            36.8
                          </span>

                          <span className="mb-1 text-[11px] text-white/40">
                            °C
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[58%] rounded-full bg-[#70B8E0]" />
                          </div>

                          <span className="text-[9px] text-white/40">
                            Normal
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#16A6A1]/10 px-3 py-2.5">
                      <ShieldCheck className="h-4 w-4 text-[#58D1C6]" />

                      <span className="text-[11px] text-white/60">
                        Patient readings are within configured thresholds
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-6 text-[11px] text-white/40">
                    <span className="flex items-center gap-2">
                      <Wifi className="h-3.5 w-3.5" />
                      Connected devices
                    </span>

                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Secure access
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* ========================================================= */}
            {/* RIGHT — LOGIN                                             */}
            {/* ========================================================= */}

            <section className="flex min-h-[700px] items-center justify-center p-6 sm:p-10 lg:p-14">

              <div className="w-full max-w-[420px]">

                {/* Mobile logo */}
                <div className="mb-10 flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A6A1] text-white shadow-lg shadow-[#16A6A1]/20">
                    <HeartPulse className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-manrope text-[20px] font-bold text-[#0F2942]">
                      RemoteCare
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7A8C9A]">
                      Smart Health Monitoring
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F6F5]">
                    <Stethoscope className="h-5.5 w-5.5 text-[#16A6A1]" />
                  </div>

                  <h2 className="font-manrope text-[32px] font-bold tracking-[-0.03em] text-[#0F2942]">
                    Welcome back
                  </h2>

                  <p className="mt-2 max-w-[380px] text-[14px] leading-6 text-[#6B7D8A]">
                    Sign in to continue monitoring patients
                    and managing their health data.
                  </p>
                </div>

                {/* Login form */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-9 space-y-5"
                >

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2.5 block text-[13px] font-semibold text-[#263D4D]"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#91A2AE]"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@remotecare.com"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);

                          if (loginMutation.isError) {
                            loginMutation.reset();
                          }
                        }}
                        onBlur={() => setEmailTouched(true)}
                        disabled={loginMutation.isPending}
                        className={[
                          "h-[52px] w-full rounded-2xl border bg-white pl-11 pr-4",
                          "font-manrope text-[14px] text-[#172B3A]",
                          "placeholder:text-[#A4B1BA]",
                          "outline-none transition-all",
                          "focus:border-[#16A6A1]",
                          "focus:ring-4 focus:ring-[#16A6A1]/10",
                          emailTouched && !emailIsValid
                            ? "border-[#DC4C4C]"
                            : "border-[#DCE7EE]",
                        ].join(" ")}
                      />
                    </div>

                    {emailTouched && !emailIsValid && (
                      <p className="mt-2 text-[11px] font-medium text-[#DC4C4C]">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2.5 block text-[13px] font-semibold text-[#263D4D]"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#91A2AE]"
                      />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);

                          if (loginMutation.isError) {
                            loginMutation.reset();
                          }
                        }}
                        onBlur={() => setPasswordTouched(true)}
                        disabled={loginMutation.isPending}
                        className={[
                          "h-[52px] w-full rounded-2xl border bg-white pl-11 pr-12",
                          "font-manrope text-[14px] text-[#172B3A]",
                          "placeholder:text-[#A4B1BA]",
                          "outline-none transition-all",
                          "focus:border-[#16A6A1]",
                          "focus:ring-4 focus:ring-[#16A6A1]/10",
                          passwordTouched && !passwordIsValid
                            ? "border-[#DC4C4C]"
                            : "border-[#DCE7EE]",
                        ].join(" ")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#91A2AE] transition-colors hover:bg-[#F1F6F8] hover:text-[#526A79]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-[17px] w-[17px]" />
                        ) : (
                          <Eye className="h-[17px] w-[17px]" />
                        )}
                      </button>
                    </div>

                    {passwordTouched && !passwordIsValid && (
                      <p className="mt-2 text-[11px] font-medium text-[#DC4C4C]">
                        Please enter your password.
                      </p>
                    )}
                  </div>

                  {/* API error */}
                  {loginMutation.isError && (
                    <div
                      role="alert"
                      className="rounded-2xl border border-[#DC4C4C]/20 bg-[#DC4C4C]/[0.06] px-4 py-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DC4C4C]/10">
                          <span className="text-[12px] font-bold text-[#DC4C4C]">
                            !
                          </span>
                        </div>

                        <p className="text-[12px] leading-5 text-[#A63C3C]">
                          {getLoginErrorMessage(
                            loginMutation.error
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={
                      loginMutation.isPending ||
                      !formIsValid
                    }
                    className={[
                      "group relative flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl",
                      "font-manrope text-[14px] font-bold text-white",
                      "transition-all duration-200",
                      "bg-[#1677A8]",
                      "shadow-[0_8px_24px_rgba(22,119,168,0.20)]",
                      "hover:bg-[#126A97]",
                      "hover:shadow-[0_10px_28px_rgba(22,119,168,0.25)]",
                      "active:scale-[0.99]",
                      "disabled:cursor-not-allowed disabled:bg-[#AFC3CE] disabled:shadow-none",
                    ].join(" ")}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Security message */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#F5F9FB] p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-[#16A6A1]" />
                  </div>

                  <div>
                    <p className="text-[12px] font-semibold text-[#344D5D]">
                      Secure healthcare access
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#7A8C9A]">
                      Your account provides secure access to
                      patient monitoring and health information.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-[11px] text-[#91A0AA]">
                  RemoteCare Smart Health Monitoring System
                </p>

              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}