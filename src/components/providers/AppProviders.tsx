"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/contexts/language-context";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  );
}

