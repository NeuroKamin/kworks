import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";

import { NavUser } from "./nav-user";
import { NavOrganizations } from "./nav-organizations";
import { NavMain } from "./nav-main";

import { getUserOrganizations } from "@/actions/organizations";
import { auth } from "@/auth";
import { getSidebarItems } from "@/actions/sidebar";

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const [organizations, sidebarItems] = await Promise.all([
    getUserOrganizations(session.user.id!),
    getSidebarItems(),
  ]);

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <NavOrganizations Organizations={organizations} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
