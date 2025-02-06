import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";

import { NavUser } from "./nav-user";
import { NavSpaces } from "./nav-spaces";
import { NavMain } from "./nav-main";

import { getUserSpaces } from "@/actions/spaces";
import { auth } from "@/auth";
import { getSidebarItems } from "@/actions/sidebar";

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const [spaces, sidebarItems] = await Promise.all([
    getUserSpaces(session.user.id!),
    getSidebarItems(),
  ]);

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <NavSpaces spaces={spaces} />
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
