import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";

import { NavUser } from "./nav-user";
import { NavOrganisations } from "./nav-organisations";
import { NavMain } from "./nav-main";

import { getSelectedOrganization } from "@/actions/organizations";
import { getUserOrganizations } from "@/actions/organizations";
import { auth } from "@/auth";
import { getSidebarItems } from "@/actions/sidebar";

export async function AppSidebar() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const [organizations, selectedOrganization, sidebarItems] = await Promise.all(
    [
      getUserOrganizations(session.user.id!),
      getSelectedOrganization(session.user.id!),
      getSidebarItems(),
    ],
  );

  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <NavOrganisations
          organizations={organizations}
          selectedOrganization={selectedOrganization?.id ?? ""}
        />
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
