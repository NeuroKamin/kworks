import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@workspace/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { BadgeCheck, Bell, ChevronsUpDown, User } from "lucide-react";

import { SignOut } from "./sign-out";

import { auth } from "@/auth";

export async function NavUser() {
  const session = await auth();
  if (!session?.user) return null;

  const user = session.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg shrink-0">
                <AvatarImage src={user.image!} alt={user.name!} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground p-1">
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center text-left text-sm leading-tight w-full">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full min-w-56 rounded-lg"
            side="top"
            align="center"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg shrink-0">
                  <AvatarImage src={user.image!} alt={user.name!} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground p-1">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center text-left text-sm leading-tight w-full">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Аккаунт
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Уведомления
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOut />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
