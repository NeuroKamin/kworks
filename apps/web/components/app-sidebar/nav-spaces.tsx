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
import { TSpace } from "@workspace/database/types";

import { SpaceIcon } from "@/components/space-icon";
import { useSpace } from "@/store/space";

export function NavSpaces({ spaces }: { spaces: TSpace[] }) {
  const { currentSpace, setSpace } = useSpace();

  const filteredSpaces = spaces.filter((space) => space.id !== currentSpace.id);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <SpaceIcon icon="IconStack2" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentSpace?.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentSpace?.description || "Без описания"}
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
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map((space) => (
                <DropdownMenuItem
                  key={space.id}
                  onClick={() => setSpace(space)}
                  className="gap-2 p-2 group items-center"
                >
                  <SpaceIcon icon="IconStack2" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{space.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {space.description || "Без описания"}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="font-medium text-xs text-muted-foreground text-center justify-center">
                Добавить организацию
              </DropdownMenuItem>
            )}
            {filteredSpaces.length > 0 && (
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
