'use client';
import React from "react";
import './nghich.css';
import WithCounter from "./withcounter";
import Counter from "./counter";
import withCart from "./withCart";
import ShoppingCartUI from "./ShoppingCart";
import { ProtectedUserProfile, ProtectedAdminDashboard } from "./ProtectedComponents";

export default function Page() {

    const EnhancedCounter = WithCounter(Counter);
    const EnhancedCart = withCart(ShoppingCartUI);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-full py-2">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                Welcome to Vudung App
            </h1>
            <EnhancedCounter />
            
            <hr style={{width: '100%', margin: '40px 0'}} />
            
            <h2 className="text-2xl font-bold mb-4">Ví dụ Shopping Cart (HOC)</h2>
            <EnhancedCart />

            <hr style={{width: '100%', margin: '40px 0'}} />
            
            <h2 className="text-2xl font-bold mb-4">Ví dụ Authentication & Authorization (HOC)</h2>
            <div className="flex flex-col gap-4 w-full max-w-2xl px-4">
                <ProtectedUserProfile />
                <ProtectedAdminDashboard />
                
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                    <p><strong>Ghi chú:</strong> Bạn có thể mở file <code>withAuth.tsx</code> và thay đổi giá trị trong hàm <code>useAuth</code> (đổi role thành 'user' hoặc set user thành 'null') để xem các trạng thái phân quyền khác nhau hoạt động như thế nào.</p>
                </div>
            </div>
            
            <div className="mb-10"></div>
        </div>
    )


}