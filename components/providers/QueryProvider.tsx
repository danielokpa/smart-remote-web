"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import { useState } from "react";

import { ApiError } from "@/lib/api/api-client";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({
  children,
}: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,

            retry: (failureCount, error) => {
              if (
                error instanceof ApiError &&
                error.statusCode >= 400 &&
                error.statusCode < 500
              ) {
                return false;
              }

              return failureCount < 3;
            },

            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },

          mutations: {
            retry: (failureCount, error) => {
              if (
                error instanceof ApiError &&
                error.statusCode >= 400 &&
                error.statusCode < 500
              ) {
                return false;
              }

              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}