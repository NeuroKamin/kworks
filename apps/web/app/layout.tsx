import { Geist, Geist_Mono } from "next/font/google";

import "@/styles/globals.css";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";

import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/app-sidebar";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await cookies()).get("sidebar:state");
  const open = cookie?.value === "true";

  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <SidebarProvider defaultOpen={open}>
            <AppSidebar />
            <main className="w-full h-full py-2">{children}</main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
