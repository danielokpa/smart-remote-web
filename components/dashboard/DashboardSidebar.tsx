"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { HeartPulse, LogOut, X } from "lucide-react";

import { useRemoteCareUI } from "@/lib/hooks/dashboard/useDashboardUi";

interface DashboardSidebarProps {
  onClose?: () => void;
  onLogout?: () => void;
}

export default function DashboardSidebar({
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const {
    navItems,
    label,
  } = useRemoteCareUI();

  return (
    <aside
      className={clsx(
        "w-[280px] shrink-0",
        "h-dvh min-h-0",
        "bg-[#071A17]",
        "border-r border-white/10",
        "flex flex-col",
        "overflow-hidden"
      )}
    >
      {/* Brand */}
      <div className="border-b border-white/10 px-5 py-4.5">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {/* Logo */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#0E2723]">
              <HeartPulse className="h-5 w-5 text-[#2DD4BF]" />
            </div>

            {/* Brand text */}
            <div className="min-w-0">
              <p className="truncate font-manrope font-bold leading-tight text-white">
                Remote Care
              </p>

              <p className="truncate font-manrope text-[12px] leading-tight text-[#8FA8A2]">
                {label}
              </p>
            </div>
          </div>

          {/* Mobile close */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/5 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        <p className="px-3 pb-2 font-manrope text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6F8982]">
          Navigation
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3",
                  "border transition-all duration-200",
                  active
                    ? "border-[#2DD4BF]/15 bg-[#0E2723]"
                    : "border-transparent hover:border-white/5 hover:bg-white/[0.035]"
                )}
              >
                {/* Icon */}
                <div
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition",
                    active
                      ? "border-[#2DD4BF]/20 bg-[#12352F]"
                      : "border-white/10 bg-white/[0.025] group-hover:bg-white/[0.05]"
                  )}
                >
                  <Icon
                    className={clsx(
                      "h-5 w-5 transition",
                      active
                        ? "text-[#2DD4BF]"
                        : "text-[#718A84] group-hover:text-white"
                    )}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p
                    className={clsx(
                      "truncate font-manrope text-[14px] font-semibold",
                      active
                        ? "text-white"
                        : "text-[#9BAEA9] group-hover:text-white"
                    )}
                  >
                    {item.label}
                  </p>

                  {item.description && (
                    <p className="truncate font-manrope text-[12px] text-white/35">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Active indicator */}
                {active && (
                  <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto px-3 pb-5">
        <div className="rounded-2xl border border-white/10 bg-[#0E2723] p-2">
          <button
            type="button"
            onClick={onLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025]">
              <LogOut className="h-5 w-5 text-[#718A84] transition group-hover:text-[#F87171]" />
            </div>

            <div className="min-w-0">
              <p className="font-manrope text-[14px] font-semibold text-white">
                Sign out
              </p>

              <p className="font-manrope text-[12px] text-[#718A84]">
                End your secure session
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}