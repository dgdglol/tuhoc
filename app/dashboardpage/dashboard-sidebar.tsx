'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Layers,
  ChevronRight,
  Bell,
} from "lucide-react"
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
} from "@/components/ui/sidebar"

// Danh sách menu phân nhóm chuyên nghiệp
const mainNavItems = [
  {
    title: "Tổng quan",
    href: "/dashboardpage",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Khách hàng",
    href: "/dashboardpage/users",
    icon: Users,
    badge: "1.2k",
  },
  {
    title: "Đơn hàng",
    href: "/dashboardpage/orders",
    icon: ShoppingBag,
    badge: "12 mới",
    badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },
  {
    title: "Báo cáo & Thống kê",
    href: "/dashboardpage/analytics",
    icon: BarChart3,
    badge: null,
  },
]

const systemNavItems = [
  {
    title: "Thông báo",
    href: "/dashboardpage/notifications",
    icon: Bell,
    badge: "3",
    badgeColor: "bg-rose-50 text-rose-600 border border-rose-200",
  },
  {
    title: "Cài đặt hệ thống",
    href: "/dashboardpage/settings",
    icon: Settings,
    badge: null,
  },
  {
    title: "Trợ giúp & FAQ",
    href: "/dashboardpage/help",
    icon: HelpCircle,
    badge: null,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  // Kiểm tra link active linh hoạt
  const checkActive = (href: string) => {
    if (href === "/dashboardpage") {
      return pathname === "/dashboardpage"
    }
    return pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-white">
      {/* 1. Header Sidebar: Logo & Tên dự án */}
      <SidebarHeader className="border-b border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden transition-all group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                VDung Admin
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                PRO
              </span>
            </div>
            <span className="text-xs text-slate-500 truncate">
              Hệ thống quản trị
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* 2. Nội dung Menu */}
      <SidebarContent className="px-2 py-3 space-y-4">
        {/* Nhóm 1: Quản trị chính */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quản trị & Bán hàng
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNavItems.map((item) => {
                const IconComponent = item.icon
                const isActive = checkActive(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} className="flex w-full items-center" />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      <IconComponent
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>

                      {/* Badge số liệu */}
                      {item.badge && (
                        <span
                          className={`ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold group-data-[collapsible=icon]:hidden ${
                            item.badgeColor || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nhóm 2: Cài đặt & Hỗ trợ */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Hệ thống
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {systemNavItems.map((item) => {
                const IconComponent = item.icon
                const isActive = checkActive(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} className="flex w-full items-center" />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      <IconComponent
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>

                      {item.badge && (
                        <span
                          className={`ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-semibold group-data-[collapsible=icon]:hidden ${
                            item.badgeColor || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Footer: Thẻ User Profile & Nút Đăng xuất */}
      <SidebarFooter className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition-colors">
          {/* Avatar có viền và hiệu ứng gradient */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 font-semibold text-xs text-white ring-2 ring-white shadow-xs">
            VD
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          {/* Tên & Role */}
          <div className="flex flex-1 flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-semibold text-slate-900 truncate">
              Bùi Vũ Dũng
            </span>
            <span className="text-[11px] text-slate-500 truncate">
              Super Admin
            </span>
          </div>

          {/* Nút Đăng xuất nhanh */}
          <button
            title="Đăng xuất"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors group-data-[collapsible=icon]:hidden"
            onClick={() => {
              // Xử lý logout hoặc điều hướng
              console.log("Logout clicked")
            }}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
