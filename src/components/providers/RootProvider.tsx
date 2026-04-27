"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { PropertyProvider } from "./PropertyContext";
import { AuthProvider } from "./AuthContext";

export function RootProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <PropertyProvider>
            {children}
          </PropertyProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
