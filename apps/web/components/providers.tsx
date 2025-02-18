"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { TSpace } from "@workspace/database/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

import { SpaceProvider } from "@/store/space";

export function Providers({
  children,
  selectedSpace,
}: {
  children: React.ReactNode;
  selectedSpace: TSpace;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      enableColorScheme
    >
      <NuqsAdapter>
        <SessionProvider>
          <TooltipProvider>
            <SpaceProvider Space={selectedSpace}>{children}</SpaceProvider>
          </TooltipProvider>
        </SessionProvider>
      </NuqsAdapter>
    </NextThemesProvider>
  );
}
