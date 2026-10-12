import { ArrowUpRight, DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

export default function Dashboardpage() {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "128.450.000 ₫",
      change: "+14.2%",
      isPositive: true,
      desc: "so với tháng trước",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Đơn hàng mới",
      value: "+1,429",
      change: "+8.1%",
      isPositive: true,
      desc: "so với tuần trước",
      icon: ShoppingCart,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Khách hàng mới",
      value: "+482",
      change: "+18.7%",
      isPositive: true,
      desc: "trong 30 ngày qua",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Tỷ lệ tăng trưởng",
      value: "24.6%",
      change: "+4.3%",
      isPositive: true,
      desc: "mục tiêu quý này",
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Giới thiệu */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Tổng quan kinh doanh 🚀
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Xin chào Bùi Vũ Dũng! Đây là tình hình hoạt động của hệ thống hôm nay.
        </p>
      </div>

      {/* Grid các thẻ thống kê (KPI Cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  <span className="inline-flex items-center font-semibold text-emerald-600">
                    <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                    {stat.change}
                  </span>
                  <span className="text-slate-400">{stat.desc}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder bảng hoạt động gần đây */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-base font-semibold text-slate-900">Đơn hàng gần đây</h3>
        <p className="text-xs text-slate-400 mt-0.5">Dữ liệu cập nhật theo thời gian thực</p>
        
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-700">Chưa có giao dịch phát sinh trong 1 giờ qua</p>
          <p className="text-xs text-slate-400 mt-1">Các đơn hàng mới sẽ tự động hiển thị tại đây.</p>
        </div>
      </div>
    </div>
  );
}