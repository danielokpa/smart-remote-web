"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

import { authStorage } from "@/lib/store/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* REFS                                                                   */
  /* ---------------------------------------------------------------------- */

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);

  /* ---------------------------------------------------------------------- */
  /* LOGOUT                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleLogout = () => {
    authStorage.clearSession();

    setSidebarOpen(false);

    router.replace("/");
  };

  /* ---------------------------------------------------------------------- */
  /* CLOSE DRAWER ON ROUTE CHANGE                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  /* ---------------------------------------------------------------------- */
  /* CLOSE ON ESC                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  /* ---------------------------------------------------------------------- */
  /* CLOSE WHEN CLICKING OUTSIDE MOBILE DRAWER                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (!sidebarOpen) return;

      const target = event.target as Node;

      const clickedDrawer =
        drawerRef.current?.contains(target);

      const clickedButton =
        openBtnRef.current?.contains(target);

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

  /* ---------------------------------------------------------------------- */
  /* PREVENT BACKGROUND SCROLL WHEN MOBILE DRAWER IS OPEN                  */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    document.body.style.overflow = sidebarOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* ---------------------------------------------------------------------- */
  /* LOCK OUTER PAGE SCROLL                                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <ProtectedRoute>
      <div className="h-[100dvh] bg-[#071A17] text-white overflow-hidden">
        <div className="flex h-full">

          {/* Desktop sidebar */}
          <div className="hidden lg:block h-full">
            <DashboardSidebar
              onLogout={handleLogout}
            />
          </div>

          {/* Main column */}
          <div className="flex-1 min-w-0 flex flex-col h-full">

            <DashboardTopbar
              onOpenSidebar={() => setSidebarOpen(true)}
              menuButtonRef={openBtnRef}
              onLogout={handleLogout}
            />

            {/* Scrollable dashboard content */}
            <main className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-6 py-6">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={[
            "lg:hidden fixed inset-0 z-[80]",
            sidebarOpen
              ? "pointer-events-auto"
              : "pointer-events-none",
          ].join(" ")}
          aria-hidden={!sidebarOpen}
        >
          {/* Backdrop */}
          <div
            className={[
              "absolute inset-0 transition-opacity duration-200",
              sidebarOpen
                ? "opacity-100 bg-black/40"
                : "opacity-0 bg-black/0",
            ].join(" ")}
          />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className={[
              "absolute left-0 top-0 h-full",
              "transition-transform duration-200",
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full",
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