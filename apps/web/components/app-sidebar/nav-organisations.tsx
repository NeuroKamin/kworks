"use client";

import * as React from "react";
import { ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

export function NavOrganisations({
  organizations,
  selectedOrganization,
}: {
  organizations: {
    id: string;
    name: string;
    description: string | null;
  }[];
  selectedOrganization: string;
}) {
  const [activeOrganization, setActiveOrganization] = React.useState(
    organizations.find((org) => org.id === selectedOrganization),
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrganization?.name}
                </span>
                <span className="truncate text-xs">
                  {activeOrganization?.description ?? "Организация"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="center"
            side="bottom"
          >
            {organizations.map((organization, index) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() => setActiveOrganization(organization)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                {organization.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-medium text-xs text-muted-foreground text-center justify-center">
              Добавить организацию
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
