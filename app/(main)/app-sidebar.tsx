'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderGit2,
  FlaskConical,
  LayoutDashboard,
  Dices,
  Clock,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "cn";

const navItems = [
  {
    title: "Trang chủ (CV)",
    href: "/",
    icon: Home,
  },
  {
    title: "Dự án",
    href: "/projects",
    icon: FolderGit2,
  },
  {
    title: "Nghịch linh tinh (Lab)",
    href: "/nghichlinhtinh",
    icon: FlaskConical,
  },
  {
    title: "Bảng điều khiển",
    href: "/dashboardpage",
    icon: LayoutDashboard,
  },
  {
    title: "Game",
    href: "/game",
    icon: Dices,
  },
  {
    title: "Fetch Demo",
    href: "/fetch-demo",
    icon: Clock,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-white">
      <SidebarHeader className="border-b border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white font-bold text-sm shadow-xs">
            VD
          </div>
          <div className="flex flex-col overflow-hidden transition-all group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm tracking-tight text-slate-900 truncate">
              Bùi Vũ Dũng
            </span>
            <span className="text-xs text-slate-500 truncate">
              Portfolio & Labs
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Điều hướng
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isItemActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} className="flex w-full items-center gap-3" />}
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-slate-100 text-slate-900 font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                          active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                        )}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-3">
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 group-data-[collapsible=icon]:hidden">
          <span>© 2026 Bùi Vũ Dũng</span>
          <Link href="/" className="font-medium text-slate-700 hover:text-slate-900 hover:underline">
            CV cá nhân →
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}