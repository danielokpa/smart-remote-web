"use client";

import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { removeAuthToken, removeStationLoginType } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ refs for click-outside (menu + button)
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // ✅ Close when clicking outside (NO fullscreen overlay)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!mobileOpen) return;

      const target = event.target as Node;

      const clickedMenu = menuRef.current?.contains(target);
      const clickedButton = buttonRef.current?.contains(target);

      if (!clickedMenu && !clickedButton) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    removeStationLoginType();
    removeAuthToken();
    setMobileOpen(false);
    router.push("/login");
  };

  const navLinkBase = "font-manrope font-medium text-[15px] transition-colors";
  const isActive = (href: string) => pathname === href;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#11021f] text-white">
        {/* Dashboard Navbar */}
        <nav className="sticky top-0 z-50 bg-[#11021f]/95 backdrop-blur-md border-b border-white/10">
          {/* ✅ relative anchor for dropdown */}
          <div className="container-edge py-4 relative">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/dashboard/conversions"
                className="flex items-center gap-2"
              >
                <Image
                  src="/images/navbar-logo.png"
                  alt="PEPPCruise logo"
                  width={32}
                  height={30}
                  className="object-contain"
                />
                <span className="font-manrope font-bold text-[20px] leading-[150%] text-white">
                  PEPP Cruise
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard/conversions"
                  className={`${navLinkBase} ${
                    isActive("/dashboard/conversions")
                      ? "text-[#762FB8]"
                      : "text-[#8E94A4] hover:text-white"
                  }`}
                >
                  Conversions
                </Link>

                <Link
                  href="/dashboard/profile"
                  className={`${navLinkBase} ${
                    isActive("/dashboard/profile")
                      ? "text-[#762FB8]"
                      : "text-[#8E94A4] hover:text-white"
                  }`}
                >
                  Profile
                </Link>

                <Link
                  href="/dashboard/settings"
                  className={`${navLinkBase} ${
                    isActive("/dashboard/settings")
                      ? "text-[#762FB8]"
                      : "text-[#8E94A4] hover:text-white"
                  }`}
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className={`${navLinkBase} text-[#8E94A4] hover:text-white`}
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition"
              >
                {mobileOpen ? (
                  // X icon
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* ✅ Mobile Dropdown (no fullscreen overlay, less transparent) */}
            {mobileOpen && (
              <div
                ref={menuRef}
                className="md:hidden absolute left-0 right-0 top-full mt-3 z-50"
              >
                <div className="relative rounded-2xl border border-white/10 bg-[#1b0d2b] backdrop-blur-xl shadow-2xl overflow-hidden">
                  {/* subtle inner overlay to add depth */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />

                  <div className="relative p-2">
                    <Link
                      href="/dashboard/conversions"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-xl px-4 py-3 ${navLinkBase} ${
                        isActive("/dashboard/conversions")
                          ? "bg-white/10 text-white"
                          : "text-[#8E94A4] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Conversions
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-xl px-4 py-3 ${navLinkBase} ${
                        isActive("/dashboard/profile")
                          ? "bg-white/10 text-white"
                          : "text-[#8E94A4] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Profile
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-xl px-4 py-3 ${navLinkBase} ${
                        isActive("/dashboard/settings")
                          ? "bg-white/10 text-white"
                          : "text-[#8E94A4] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className={`w-full text-left rounded-xl px-4 py-3 ${navLinkBase} text-[#8E94A4] hover:bg-white/10 hover:text-white`}
                    >
                      Logout
                    </button>
                  </div>

                  <div className="h-px bg-white/10" />
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="container-edge py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
