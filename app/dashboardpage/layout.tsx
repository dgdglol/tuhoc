import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/app/dashboardpage/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar bên trái */}
      <DashboardSidebar />

      {/* Vùng nội dung và header bên phải */}
      <SidebarInset className="flex flex-col min-h-screen bg-slate-50/50">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 backdrop-blur px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
            <Separator orientation="vertical" className="h-5" />
            <h1 className="text-sm font-semibold text-slate-800">
              Bảng điều khiển quản trị
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">Bùi Vũ Dũng</span>
              <span className="text-[10px] text-slate-400">admin@vudung.dev</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-xs font-semibold text-white shadow-xs">
              VD
            </div>
          </div>
        </header>

        {/* Nội dung trang */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
