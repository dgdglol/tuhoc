'use client';
import React, { useEffect, useState } from 'react';
import { withAuthentication, withAuthorization } from './withAuth';

interface UserDataItem {
    id: number;
    username: string;
    password?: string;
    role?: string;
    balance?: number;
}

// 1. Component thường (Cả User và Admin đã đăng nhập đều xem được)
const UserProfileComponent = () => {
    return (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">User Profile (Khu vực dành cho User &amp; Admin)</h3>
            <p className="text-blue-600 text-sm">
                Bạn đã đăng nhập thành công. Với quyền <strong>user</strong>, bạn có thể xem CV, các dự án và chơi game nhưng không xem được dữ liệu người dùng hệ thống.
            </p>
        </div>
    );
};

// 2. Component nhạy cảm (Chỉ Admin mới xem được danh sách data người dùng)
const AdminDashboardComponent = () => {
    const [users, setUsers] = useState<UserDataItem[]>([]);

    useEffect(() => {
        fetch('/api/users')
            .then((r) => r.json())
            .then((d) => {
                if (d.success && Array.isArray(d.users)) setUsers(d.users);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg shadow-sm space-y-3">
            <h3 className="text-xl font-semibold text-purple-800">
                👑 Admin Data Panel (Chỉ Admin mới xem được data người dùng)
            </h3>
            <p className="text-purple-600 text-sm">
                Danh sách tài khoản đọc trực tiếp từ <code>data/users.json</code>:
            </p>
            <div className="overflow-x-auto bg-white rounded-lg border border-purple-200">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-purple-100/70 text-purple-900 border-b border-purple-200">
                            <th className="py-2 px-3">Username</th>
                            <th className="py-2 px-3">Password</th>
                            <th className="py-2 px-3">Role</th>
                            <th className="py-2 px-3">Điểm tích lũy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100">
                        {users.map((u) => (
                            <tr key={u.id || u.username}>
                                <td className="py-2 px-3 font-bold text-gray-800">{u.username}</td>
                                <td className="py-2 px-3 font-mono text-gray-600">{u.password}</td>
                                <td className="py-2 px-3 uppercase font-semibold text-purple-700">{u.role || 'user'}</td>
                                <td className="py-2 px-3 text-emerald-600 font-semibold">{(u.balance ?? 0).toLocaleString()} điểm</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Bọc các component với HOC tương ứng
export const ProtectedUserProfile = withAuthentication(UserProfileComponent);
export const ProtectedAdminDashboard = withAuthorization(AdminDashboardComponent, ['admin']); // Chỉ admin mới xem được

