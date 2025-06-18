import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { Toaster } from "@workspace/ui/components/sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { getSelectedSpace } from "@/actions/spaces";
import { SiteHeader } from "@/components/header";
const RootLayout = async ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  const cookie = (await cookies()).get("sidebar_state");
  const open = cookie?.value === "true";
  const selectedSpace = await getSelectedSpace();

  return (
    <Providers selectedSpace={selectedSpace}>
      <SidebarProvider defaultOpen={open}>
        <AppSidebar />
        <main className="w-full h-full">
          <SiteHeader />
          {children}
          {modal}
        </main>
      </SidebarProvider>
      <Toaster />
    </Providers>
  );
};

export default RootLayout;
