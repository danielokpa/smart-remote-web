"use client";

import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname, useRouter } from "next/navigation";
import { removeAuthToken, removeStationLoginType } from "@/lib/api";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // refs for click-outside (mobile drawer + open button)
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleLogout = () => {
    removeStationLoginType();
    removeAuthToken();
    setSidebarOpen(false);
    router.push("/login");
  };

  // Close on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    if (sidebarOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  // Close when clicking outside (mobile)
  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (!sidebarOpen) return;

      const target = event.target as Node;
      const clickedDrawer = drawerRef.current?.contains(target);
      const clickedButton = openBtnRef.current?.contains(target);

      if (!clickedDrawer && !clickedButton) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [sidebarOpen]);

  // Prevent background scroll only when drawer open (mobile)
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // ✅ LOCK PAGE SCROLL FOR DASHBOARD (so browser scrollbar won't appear)
  // NOTE: deps array MUST be constant. Keep it as [].
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <ProtectedRoute>
      {/* full viewport shell; no body scroll */}
      <div className="h-[100dvh] bg-[#11021f] text-white overflow-hidden">
        <div className="flex h-full">
          {/* Desktop sidebar */}
          <div className="hidden lg:block h-full">
            <DashboardSidebar onLogout={handleLogout} />
          </div>

          {/* Main column */}
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <DashboardTopbar
              onOpenSidebar={() => setSidebarOpen(true)}
              menuButtonRef={openBtnRef}
              onLogout={handleLogout}
            />

            {/* ✅ ONLY THIS SCROLLS + scrollbar hidden */}
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-6 py-6">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={[
            "lg:hidden fixed inset-0 z-[80]",
            sidebarOpen ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
          aria-hidden={!sidebarOpen}
        >
          {/* subtle backdrop */}
          <div
            className={[
              "absolute inset-0 transition-opacity",
              sidebarOpen ? "opacity-100 bg-black/30" : "opacity-0 bg-black/0",
            ].join(" ")}
          />

          {/* drawer */}
          <div
            ref={drawerRef}
            className={[
              "absolute left-0 top-0 h-full transition-transform duration-200",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            <DashboardSidebar
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
