"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { X, LogOut } from "lucide-react";
import { useStationUI } from "@/lib/hooks/dashboard/useStationUi";

export default function DashboardSidebar({
  onClose,
  onLogout,
}: {
  onClose?: () => void; // used only in mobile drawer
  onLogout?: () => void;
}) {
  const pathname = usePathname();
  const { navItems, label , labels} = useStationUI();

  return (
    <aside
      className={clsx(
        "w-[280px] shrink-0",
        "h-screen",
        "bg-[#11021f] border-r border-white/10",
        "flex flex-col",
        "overflow-hidden" // ✅ prevents sidebar scroll
      )}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#251a34] border border-white/10 flex items-center justify-center">
              <span className="font-manrope font-bold text-white">P</span>
            </div>

            <div>
              <p className="font-manrope font-bold text-white leading-tight">
                PEPP Cruise
              </p>
              <p className="font-manrope text-[12px] text-[#8E94A4]">
                {label}
              </p>
            </div>
          </div>

          {/* Mobile close (only visible inside drawer) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav (no scroll) */}
      <nav className="px-3 py-4">
        <p className="px-3 pb-2 font-manrope text-[12px] text-[#8E94A4] uppercase tracking-wider">
          Navigation
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 transition",
                  active
                    ? "bg-white/8 border border-white/10"
                    : "hover:bg-white/5"
                )}
              >
                <div
                  className={clsx(
                    "w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center",
                    active ? "bg-[#251a34]" : "bg-[#251a34]/60"
                  )}
                >
                  <Icon
                    className={clsx(
                      "w-5 h-5",
                      active ? "text-white" : "text-[#8E94A4] group-hover:text-white"
                    )}
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className={clsx(
                      "font-manrope font-semibold text-[14px] truncate",
                      active ? "text-white" : "text-[#8E94A4] group-hover:text-white"
                    )}
                  >
                    {item.label}
                  </p>
                  <p className="font-manrope text-[12px] text-white/40 truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer pinned to bottom */}
      <div className="mt-auto px-3 pb-5">
        <div className="rounded-2xl bg-[#251a34] border border-white/10 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/5 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2d1f3f] border border-white/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-[#8E94A4]" />
            </div>
            <div className="text-left">
              <p className="font-manrope font-semibold text-[14px] text-white">
                Logout
              </p>
              <p className="font-manrope text-[12px] text-[#8E94A4]">
                Sign out securely
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
