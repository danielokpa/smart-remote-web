"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/api/api-client";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
    } else {
      setAuthenticated(true);
    }

    setMounted(true);
  }, [router]);

  // ✅ CRITICAL: same output on server + first client render
  if (!mounted) {
    return (
      <div className="h-[100dvh] bg-[#11021f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}