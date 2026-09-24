import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../(main)/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(main)/app-sidebar";

export const metadata: Metadata = {
  title: "nghichlinhtinh | Bùi Vũ Dũng",
  description: "nháp",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="min-w-0 flex-1">
            <div className="flex items-center gap-2 p-4">
              <SidebarTrigger />
              <span className="font-medium">Nghịch linh tinh</span>
            </div>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}