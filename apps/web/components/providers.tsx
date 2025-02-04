"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { TOrganization } from "@workspace/database/types";

import { OrganizationProvider } from "@/store/organistaion";

export function Providers({
  children,
  selectedOrganization,
}: {
  children: React.ReactNode;
  selectedOrganization: TOrganization;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      enableColorScheme
    >
      <SessionProvider>
        <OrganizationProvider Organization={selectedOrganization}>
          {children}
        </OrganizationProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
