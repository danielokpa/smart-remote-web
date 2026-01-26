"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Car,
  Settings,
  UserCircle2,
  Menu,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

const TOP_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/conversions", label: "Conversions", icon: Car },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardTopbar({
  onOpenSidebar,
  menuButtonRef,
  onLogout,
}: {
  onOpenSidebar?: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#11021f]/95 backdrop-blur-md border-b border-white/10">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left: mobile menu + heading */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={onOpenSidebar}
              className="lg:hidden w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            <div className="hidden md:block min-w-0">
              <p className="font-manrope font-bold text-white leading-tight truncate">
                Dashboard
              </p>
              <p className="font-manrope text-[12px] text-[#8E94A4] truncate">
                Overview • conversions • operations
              </p>
            </div>
          </div>

          {/* Center: icon-only navigation */}
          <nav className="flex items-center gap-2">
            {TOP_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className={clsx(
                    "w-10 h-10 rounded-full border flex items-center justify-center transition",
                    active
                      ? "border-white/15 bg-white/5"
                      : "border-white/10 hover:bg-white/5"
                  )}
                >
                  <Icon
                    className={clsx(
                      "w-5 h-5",
                      active ? "text-white" : "text-[#8E94A4]"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right: profile + logout */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/profile"
              className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition"
              aria-label="Profile"
              title="Profile"
            >
              <UserCircle2 className="w-6 h-6 text-white" />
            </Link>

            {/* Desktop logout */}
            <button
              type="button"
              onClick={onLogout}
              className="hidden sm:inline-flex px-4 py-2 rounded-full border border-white/10 text-white font-manrope font-semibold text-[14px] hover:bg-white/5 transition"
            >
              Logout
            </button>

            {/* Mobile logout */}
            <button
              type="button"
              onClick={onLogout}
              className="sm:hidden w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
