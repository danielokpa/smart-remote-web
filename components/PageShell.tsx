"use client";

import type { ReactNode } from "react";
import { ArrowLeft, HeartPulse } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

interface PageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: ReactNode;
  backHref?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Shared page container used throughout Remote Care.
 *
 * Keeps page width, spacing, background treatment and responsive
 * horizontal padding consistent across dashboard routes.
 */
export function PageShell({
  children,
  className = "",
}: PageShellProps) {
  return (
    <main
      className={[
        "min-h-full w-full",
        "bg-[#071A17]",
        "text-white",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        {children}
      </div>
    </main>
  );
}

/**
 * Shared Remote Care page hero/header.
 *
 * Designed to work for dashboard pages, settings pages,
 * management pages and patient-facing workflows.
 */
export function PageHero({
  title,
  description,
  eyebrow = "Remote Care",
  icon,
  backHref,
  actions,
  className = "",
}: PageHeroProps) {
  const router = useRouter();

  return (
    <header
      className={[
        "relative overflow-hidden rounded-3xl",
        "border border-white/10",
        "bg-[#0E2723]",
        className,
      ].join(" ")}
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#2DD4BF]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-[#2DD4BF]/5 blur-3xl"
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
        <div className="min-w-0">
          {/* Back button */}
          {backHref && (
            <button
              type="button"
              onClick={() => router.push(backHref)}
              className="mb-4 inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-[#8FA8A2] transition hover:text-[#2DD4BF] focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          )}

          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/10 sm:flex">
              {icon ?? (
                <HeartPulse className="h-5 w-5 text-[#2DD4BF]" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2DD4BF]">
                {eyebrow}
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {title}
              </h1>

              {description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8FA8A2]">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Optional actions */}
        {actions && (
          <div className="relative flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}