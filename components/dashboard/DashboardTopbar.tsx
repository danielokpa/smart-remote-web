"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LogOut,
  Menu,
  UserCircle2,
} from "lucide-react";

import { authStorage } from "@/lib/store/auth";
import { useRemoteCareUI } from "@/lib/hooks/dashboard/useDashboardUi";

interface DashboardTopbarProps {
  onOpenSidebar?: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onLogout?: () => void;
}

export default function DashboardTopbar({
  onOpenSidebar,
  menuButtonRef,
  onLogout,
}: DashboardTopbarProps) {
  const pathname = usePathname();

  const { header } = useRemoteCareUI();

  const user = authStorage.getUser();

  const userType = user?.userType ?? "";

  const roleLabel =
    userType.charAt(0) +
    userType.slice(1).toLowerCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071A17]/95 backdrop-blur-md">
      <div className="px-4 py-3.5 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={onOpenSidebar}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/5 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>

            {/* Context */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Activity className="hidden h-4 w-4 text-[#2DD4BF] sm:block" />

                <p className="truncate font-manrope text-[15px] font-bold text-white">
                  {header.title}
                </p>
              </div>

              <p className="truncate font-manrope text-[12px] text-[#718A84]">
                {header.subtitle}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Role badge */}
            {roleLabel && (
              <div className="hidden items-center gap-2 rounded-full border border-[#2DD4BF]/15 bg-[#0E2723] px-3 py-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />

                <span className="font-manrope text-[12px] font-semibold text-[#A8BCB7]">
                  {roleLabel}
                </span>
              </div>
            )}

            {/* Profile */}
            <Link
              href="/dashboard/profile"
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full",
                "border border-white/10",
                "transition hover:bg-white/5",
                pathname === "/dashboard/profile"
                  ? "bg-white/5"
                  : "",
              ].join(" ")}
              aria-label="Profile"
              title="Profile"
            >
              <UserCircle2 className="h-5 w-5 text-white" />
            </Link>

            {/* Desktop logout */}
            <button
              type="button"
              onClick={onLogout}
              className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-manrope text-[13px] font-semibold text-white transition hover:bg-white/5 sm:inline-flex"
            >
              <LogOut className="h-4 w-4 text-[#8FA8A2]" />
              Logout
            </button>

            {/* Mobile logout */}
            <button
              type="button"
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/5 sm:hidden"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}