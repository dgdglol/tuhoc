'use client';
import React from 'react';
import { withAuthentication, withAuthorization } from './withAuth';

// 1. Component thường (Bất cứ ai đã đăng nhập cũng xem được)
const UserProfileComponent = () => {
    return (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">User Profile (Protected by Authentication)</h3>
            <p className="text-blue-600">
                Nếu bạn thấy dòng này, nghĩa là bạn đã <strong>đăng nhập</strong> thành công (Authenticated).
            </p>
        </div>
    );
};

// 2. Component nhạy cảm (Chỉ admin mới xem được)
const AdminDashboardComponent = () => {
    return (
        <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">Admin Dashboard (Protected by Authorization)</h3>
            <p className="text-purple-600">
                Nếu bạn thấy dòng này, nghĩa là bạn đã đăng nhập VÀ có quyền <strong>admin</strong> (Authorized).
            </p>
            <ul className="list-disc ml-5 mt-2 text-purple-700">
                <li>Quản lý người dùng</li>
                <li>Cấu hình hệ thống</li>
                <li>Xem báo cáo doanh thu</li>
            </ul>
        </div>
    );
};

// Bọc các component với HOC tương ứng
export const ProtectedUserProfile = withAuthentication(UserProfileComponent);
export const ProtectedAdminDashboard = withAuthorization(AdminDashboardComponent, ['admin']); // Chỉ admin mới xem được
