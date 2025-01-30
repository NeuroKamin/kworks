import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import Link from "next/link";

import { SidebarMenuButton } from "./sidebar-menu-button";

import { SidebarItem } from "@/actions/sidebar";

export function NavMain({ items }: { items: SidebarItem[] }) {
  return (
    <>
      {items.map((item) => (
        <SidebarGroup key={item.id}>
          {item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton url={item.url} tooltip={item.title}>
                      <div className="flex items-center justify-between group/item">
                        <Link
                          href={item.url}
                          className="h-full flex flex-1 items-center gap-2"
                        >
                          <item.icon className="text-foreground  size-4 group-data-[state=expanded]:text-muted-foreground group-hover/item:text-foreground transition-colors duration-500" />
                          <span>{item.title}</span>
                        </Link>
                        {item.trailingIcon && item.trailingUrl && (
                          <Link
                            href={item.trailingUrl}
                            className="group-hover/item:block hidden ml-auto"
                          >
                            <item.trailingIcon className="size-4" />
                          </Link>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
