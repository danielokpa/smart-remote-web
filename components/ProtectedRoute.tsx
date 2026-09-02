// "use client";

// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";

// import { authStorage } from "@/lib/store/auth";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export default function ProtectedRoute({
//   children,
// }: ProtectedRouteProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [mounted, setMounted] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = authStorage.getToken();
//     const user = authStorage.getUser();

//     if (!token || !user) {
//       const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

//       router.replace(redirectUrl);
//       return;
//     }

//     setAuthenticated(true);
//     setMounted(true);
//   }, [pathname, router]);

//   /**
//    * Prevent hydration mismatch.
//    * Server and initial client render produce the same UI.
//    */
//   if (!mounted) {
//     return (
//       <div className="flex h-[100dvh] items-center justify-center bg-[#071A17]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#2DD4BF]" />

//           <p className="font-manrope text-sm text-[#8FA8A2]">
//             Checking your session...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!authenticated) {
//     return null;
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { authStorage } from "@/lib/store/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    if (!token || !user) {
      router.replace(
        `/?redirect=${encodeURIComponent(pathname)}`
      );
      return;
    }

    setAuthenticated(true);
    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#071A17]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-[#2DD4BF]" />

          <p className="font-manrope text-sm text-[#8FA8A2]">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}