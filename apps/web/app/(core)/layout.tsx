import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { getSelectedOrganization } from "@/actions/organizations";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookie = (await cookies()).get("sidebar:state");
  const open = cookie?.value === "true";
  const selectedOrganization = await getSelectedOrganization();

  return (
    <Providers selectedOrganization={selectedOrganization}>
      <SidebarProvider defaultOpen={open}>
        <AppSidebar />
        <main className="w-full h-full">{children}</main>
      </SidebarProvider>
    </Providers>
  );
};

export default RootLayout;
