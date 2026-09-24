'use client';

import React, { useState, useEffect } from 'react';

// Giả lập một Hook lấy thông tin user hiện tại (Authentication)
// Trong thực tế, bạn có thể lấy từ Context, Redux, hoặc NextAuth.js
const useAuth = () => {
    // Để test, bạn có thể đổi giá trị này thành null để xem trạng thái chưa đăng nhập,
    // hoặc đổi role thành 'user' để xem Authorization hoạt động.
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    // Giả lập delay khi fetch dữ liệu auth (như đang gọi API)
    useEffect(() => {
        const timer = setTimeout(() => {
            setUser({ name: 'Dung', role: 'admin' }); // Giả lập user đã đăng nhập với quyền admin
            // setUser({ name: 'Khách', role: 'user' }); // Giả lập user đã đăng nhập với quyền user
            // setUser(null); // Giả lập chưa đăng nhập
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return { user, isAuthenticated: !!user };
};

// --- AUTHENTICATION HOC ---
// HOC kiểm tra xem người dùng đã đăng nhập chưa
export function withAuthentication<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithAuthentication(props: P) {
        const { user, isAuthenticated } = useAuth();

        if (user === undefined) { // Chờ loading... (nếu có state loading)
            return <div className="p-4 bg-gray-100 rounded-md">Đang kiểm tra thông tin đăng nhập...</div>;
        }

        if (!isAuthenticated) {
            return (
                <div className="p-4 bg-red-100 text-red-700 border border-red-300 rounded-md shadow-sm">
                    <strong>Authentication (Xác thực thất bại):</strong> Bạn chưa đăng nhập. Vui lòng đăng nhập để xem nội dung này.
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}

// --- AUTHORIZATION HOC ---
// HOC kiểm tra xem người dùng có quyền (role) phù hợp không
export function withAuthorization<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    allowedRoles: string[]
) {
    return function WithAuthorization(props: P) {
        const { user, isAuthenticated } = useAuth();

        if (!isAuthenticated || !user) {
            return (
                <div className="p-4 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-md shadow-sm">
                    <strong>Authorization (Phân quyền thất bại):</strong> Bạn chưa đăng nhập.
                </div>
            );
        }

        if (!allowedRoles.includes(user.role)) {
            return (
                <div className="p-4 bg-orange-100 text-orange-700 border border-orange-300 rounded-md shadow-sm">
                    <strong>Authorization (Phân quyền thất bại):</strong> Bạn ({user.name} - {user.role}) không có quyền truy cập nội dung này. Cần quyền: {allowedRoles.join(', ')}.
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}
