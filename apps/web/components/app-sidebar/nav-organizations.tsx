"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
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
import { TOrganization } from "@workspace/database/types";

import { OrganizationIcon } from "@/components/organization-icon";
import { useOrganization } from "@/store/organistaion";

export function NavOrganizations({
  Organizations,
}: {
  Organizations: TOrganization[];
}) {
  const { currentOrganization, setOrganization } = useOrganization();

  const filteredOrganizations = Organizations.filter(
    (Organization) => Organization.id !== currentOrganization.id,
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
              <OrganizationIcon />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentOrganization?.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentOrganization?.description || "Без описания"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
          >
            {filteredOrganizations.length > 0 ? (
              filteredOrganizations.map((Organization) => (
                <DropdownMenuItem
                  key={Organization.id}
                  onClick={() => setOrganization(Organization)}
                  className="gap-2 p-2 group items-center"
                >
                  <OrganizationIcon />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {Organization.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {Organization.description || "Без описания"}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="font-medium text-xs text-muted-foreground text-center justify-center">
                Добавить организацию
              </DropdownMenuItem>
            )}
            {filteredOrganizations.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-medium text-xs text-muted-foreground text-center justify-center">
                  Добавить организацию
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
