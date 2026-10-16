import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "../(main)/globals.css";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(main)/app-sidebar";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Nghịch linh tinh  | Bùi Vũ Dũng",
  description: "Phòng nghiên cứu React Patterns, Form Validation, Auth HOC & State Management",
};

export default function NghichLinhTinhLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-slate-50/60">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 backdrop-blur px-4 md:px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-semibold text-slate-800">
              Nghịch linh tinh
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/projects"
              className="text-slate-500 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              Danh sách dự án
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              CV cá nhân
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}