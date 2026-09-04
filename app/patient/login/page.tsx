"use client";

import {
  ArrowRight,
  HeartPulse,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { usePatientLogin } from "@/lib/hooks/auth/usePatientLogin";

export default function PatientLoginPage() {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const {
    mutate: patientLogin,
    isPending,
  } = usePatientLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedContact = contact.trim();

    if (!normalizedEmail) {
      toast.error("Email address is required.");
      return;
    }

    if (!normalizedContact) {
      toast.error("Contact number is required.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    patientLogin({
      email: normalizedEmail,
      contact: normalizedContact,
    });
  };

  return (
    <main className="min-h-screen bg-[#071A17] font-manrope text-white">
      <div className="relative flex min-h-screen overflow-hidden">
        {/* ------------------------------------------------------------------ */}
        {/* Decorative background elements                                    */}
        {/* ------------------------------------------------------------------ */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#2DD4BF]/[0.035] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#2DD4BF]/[0.025] blur-3xl" />

        {/* ------------------------------------------------------------------ */}
        {/* Left panel                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative hidden flex-1 overflow-hidden border-r border-white/[0.05] lg:flex">
          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Brand */}
            <div>
              <div className="inline-flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.07]">
                  <HeartPulse className="h-5 w-5 text-[#2DD4BF]" />
                </div>

                <div>
                  <p className="font-manrope text-sm font-extrabold tracking-tight text-white">
                    Remote Care
                  </p>

                  <p className="font-manrope text-[8px] font-semibold uppercase tracking-[0.16em] text-[#8FA8A2]/60">
                    Patient Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Main message */}
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/10 bg-[#2DD4BF]/[0.04] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />

                <span className="font-manrope text-[9px] font-bold uppercase tracking-[0.12em] text-[#2DD4BF]">
                  Secure patient access
                </span>
              </div>

              <h1 className="max-w-lg font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-5xl">
                Stay connected to your health.
              </h1>

              <p className="mt-5 max-w-md font-manrope text-sm leading-7 text-[#8FA8A2]">
                Access your Remote Care health information,
                monitoring updates, and alerts from one secure
                patient portal.
              </p>

              <div className="mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                <Feature
                  icon={<HeartPulse className="h-4 w-4" />}
                  title="Health monitoring"
                  description="Keep track of your latest readings."
                />

                <Feature
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Secure access"
                  description="Your health information stays protected."
                />
              </div>
            </div>

            {/* Footer */}
            <p className="font-manrope text-[9px] text-[#8FA8A2]/45">
              © {new Date().getFullYear()} Remote Care. Patient portal.
            </p>
          </div>

          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Right panel                                                       */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative flex w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[520px] lg:shrink-0 xl:w-[560px]">
          <div className="w-full max-w-[390px]">
            {/* Mobile brand */}
            <div className="mb-8 flex items-center justify-center lg:hidden">
              <div className="inline-flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/[0.07]">
                  <HeartPulse className="h-5 w-5 text-[#2DD4BF]" />
                </div>

                <div>
                  <p className="font-manrope text-sm font-extrabold tracking-tight text-white">
                    Remote Care
                  </p>

                  <p className="font-manrope text-[8px] font-semibold uppercase tracking-[0.16em] text-[#8FA8A2]/60">
                    Patient Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Login card */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0E2723] p-5 shadow-2xl shadow-black/20 sm:p-7">
              <div className="mb-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2DD4BF]/[0.07] text-[#2DD4BF]">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <h2 className="font-manrope text-xl font-extrabold tracking-tight text-white">
                  Patient sign in
                </h2>

                <p className="mt-1.5 font-manrope text-[10px] leading-relaxed text-[#8FA8A2]/70">
                  Enter the email address and contact number
                  associated with your patient account.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block font-manrope text-[9px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]/70"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA8A2]/50" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="Enter your email"
                      disabled={isPending}
                      className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#071A17] pl-10 pr-3.5 font-manrope text-[11px] text-white outline-none transition-colors placeholder:text-[#8FA8A2]/35 focus:border-[#2DD4BF]/35 focus:ring-1 focus:ring-[#2DD4BF]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label
                    htmlFor="contact"
                    className="mb-1.5 block font-manrope text-[9px] font-bold uppercase tracking-[0.1em] text-[#8FA8A2]/70"
                  >
                    Contact number
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA8A2]/50" />

                    <input
                      id="contact"
                      name="contact"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={contact}
                      onChange={(event) =>
                        setContact(event.target.value)
                      }
                      placeholder="+2348012345678"
                      disabled={isPending}
                      className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#071A17] pl-10 pr-3.5 font-manrope text-[11px] text-white outline-none transition-colors placeholder:text-[#8FA8A2]/35 focus:border-[#2DD4BF]/35 focus:ring-1 focus:ring-[#2DD4BF]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-1.5 font-manrope text-[8px] leading-relaxed text-[#8FA8A2]/45">
                    Use the contact number registered with your
                    patient account.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-4 font-manrope text-[10px] font-extrabold text-[#06201C] transition-all hover:bg-[#5EEAD4] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to patient portal
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Security notice */}
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.018] px-3.5 py-3">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2DD4BF]/70" />

                <p className="font-manrope text-[8px] leading-relaxed text-[#8FA8A2]/60">
                  Your login is securely verified by Remote Care.
                  Never share your patient login details with
                  anyone.
                </p>
              </div>
            </div>

            <p className="mt-5 text-center font-manrope text-[8px] text-[#8FA8A2]/40">
              Remote Care · Secure Patient Portal
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Feature                                                                    */
/* -------------------------------------------------------------------------- */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-3.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2DD4BF]/[0.06] text-[#2DD4BF]">
        {icon}
      </div>

      <p className="mt-2.5 font-manrope text-[10px] font-bold text-white/85">
        {title}
      </p>

      <p className="mt-1 font-manrope text-[8px] leading-relaxed text-[#8FA8A2]/55">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}