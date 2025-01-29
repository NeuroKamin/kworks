import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import { NavUser } from "./nav-user";
import { NavOrganisations } from "./nav-organisations";

import { getSelectedOrganization } from "@/actions/organizations";
import { getUserOrganizations } from "@/actions/organizations";
import { auth } from "@/auth";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const [organizations, selectedOrganization] = await Promise.all([
    getUserOrganizations(session.user.id!),
    getSelectedOrganization(session.user.id!),
  ]);

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <NavOrganisations
          organizations={organizations}
          selectedOrganization={selectedOrganization?.id ?? ""}
        />
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
