"use client";

import { SidebarMenuButton as UISidebarMenuButton } from "@workspace/ui/components/sidebar";
import { usePathname } from "next/navigation";

interface Props {
  url: string;
  tooltip?: string;
  children: React.ReactNode;
}

export function SidebarMenuButton({ url, tooltip, children }: Props) {
  const pathname = usePathname();

  return (
    <UISidebarMenuButton asChild tooltip={tooltip} isActive={pathname === url}>
      {children}
    </UISidebarMenuButton>
  );
}
