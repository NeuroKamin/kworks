"use client";

import { SidebarTrigger, useSidebar } from "@workspace/ui/components/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return (
      <header className="flex h-10 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GalleryVerticalEnd className="size-6 bg-gradient-to-b from-primary to-primary/70 text-primary-foreground rounded-md p-1" />
            <h1 className="text-base font-bold">kworks</h1>
          </Link>

          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
    );
  }

  return null;
}
