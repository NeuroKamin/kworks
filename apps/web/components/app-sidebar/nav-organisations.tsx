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
import { TOrganisation } from "@workspace/database/types";

import { OrganisationIcon } from "@/components/organisation-icon";
import { useOrganisation } from "@/store/organistaion";

export function NavOrganisations({
  organisations,
}: {
  organisations: TOrganisation[];
}) {
  const { currentOrganisation, setOrganisation } = useOrganisation();

  const filteredOrganisations = organisations.filter(
    (organisation) => organisation.id !== currentOrganisation.id,
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
              <OrganisationIcon />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentOrganisation?.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentOrganisation?.description || "Без описания"}
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
            {filteredOrganisations.length > 0 ? (
              filteredOrganisations.map((organisation) => (
                <DropdownMenuItem
                  key={organisation.id}
                  onClick={() => setOrganisation(organisation)}
                  className="gap-2 p-2 group items-center"
                >
                  <OrganisationIcon />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {organisation.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {organisation.description || "Без описания"}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="font-medium text-xs text-muted-foreground text-center justify-center">
                Добавить организацию
              </DropdownMenuItem>
            )}
            {filteredOrganisations.length > 0 && (
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
