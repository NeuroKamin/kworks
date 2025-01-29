import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookie = (await cookies()).get("sidebar:state");
  const open = cookie?.value === "true";

  return (
    <Providers>
      <SidebarProvider defaultOpen={open}>
        <AppSidebar />
        <main className="w-full h-full py-2">{children}</main>
      </SidebarProvider>
    </Providers>
  );
};

export default RootLayout;
