"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

interface UserRecord {
  id: number;
  username: string;
  password?: string;
  role?: string;
  balance?: number;
  createdAt?: string;
}

export default function Dashboardpage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalBalance = users.reduce((sum, u) => sum + (u.balance ?? 0), 0);

  const stats = [
    {
      title: "Tổng tài khoản hệ thống",
      value: `${users.length} người dùng`,
      change: "data/users.json",
      isPositive: true,
      desc: "đang lưu trên hệ thống",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Tổng điểm tích lũy toàn hệ thống",
      value: `${totalBalance.toLocaleString()} điểm`,
      change: "Điểm tích lũy",
      isPositive: true,
      desc: "cộng dồn tất cả user",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Tài khoản Admin",
      value: `${users.filter((u) => u.role === "admin").length}`,
      change: "Toàn quyền",
      isPositive: true,
      desc: "quản trị viên",
      icon: TrendingUp,
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "Tài khoản User thường",
      value: `${users.filter((u) => (u.role || "user") === "user").length}`,
      change: "Thành viên",
      isPositive: true,
      desc: "người dùng đã đăng ký",
      icon: ShoppingCart,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Bảng quản trị &amp; Dữ liệu người dùng (Admin Only) 👑
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Chỉ tài khoản có vai trò <strong>admin</strong> mới truy cập được trang này và xem dữ liệu từ <code>data/users.json</code>.
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

      {/* Bảng dữ liệu người dùng thật trong data/users.json */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-base font-semibold text-slate-900">
          Danh sách tài khoản người dùng (<code>data/users.json</code>)
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Dữ liệu nhạy cảm chỉ hiển thị cho Quản trị viên (Admin)
        </p>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <p className="text-sm text-slate-500 py-8 text-center">⏳ Đang tải dữ liệu người dùng...</p>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[11px]">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Username</th>
                  <th className="py-3 px-4 font-semibold">Password</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Điểm (Balance)</th>
                  <th className="py-3 px-4 font-semibold">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id || u.username} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-400">{u.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">👤 {u.username}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{u.password}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">
                      {(u.balance ?? 0).toLocaleString()} điểm
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleString("vi-VN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}