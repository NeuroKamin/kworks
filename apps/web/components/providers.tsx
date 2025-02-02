"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { TOrganisation } from "@workspace/database/types";

import { OrganisationProvider } from "@/store/organistaion";

export function Providers({
  children,
  selectedOrganisation,
}: {
  children: React.ReactNode;
  selectedOrganisation: TOrganisation;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <SessionProvider>
        <OrganisationProvider organisation={selectedOrganisation}>
          {children}
        </OrganisationProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
