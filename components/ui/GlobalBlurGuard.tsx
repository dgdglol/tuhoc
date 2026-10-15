'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface GlobalBlurGuardProps {
    children: React.ReactNode;
    /** Mức độ làm mờ (mặc định: blur-md) */
    blurIntensity?: string;
    /** Thông điệp hiển thị khi khoá */
    message?: string;
    /** Custom skeleton truyền từ ngoài vào nếu muốn (tuỳ chọn) */
    customSkeleton?: React.ReactNode;
}

export default function GlobalBlurGuard({
    children,
    blurIntensity = 'blur-md',
    message = 'Nội dung đang được bảo vệ vì quyền riêng tư',
    customSkeleton,
}: GlobalBlurGuardProps) {
    const [isProtected, setIsProtected] = useState(false);

    useEffect(() => {
        // 1. Khi người dùng chuyển tab hoặc ẩn trình duyệt
        const handleVisibilityChange = () => {
            setIsProtected(document.visibilityState !== 'visible');
        };

        // 2. Khi người dùng click ra ngoài cửa sổ trình duyệt (mất focus)
        const handleWindowBlur = () => setIsProtected(true);
        const handleWindowFocus = () => setIsProtected(false);

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, []);

    return (
        <div className="relative min-h-screen w-full">
            {/* Khi bị khoá/rời màn hình: Ẩn nội dung thật và thay thế bằng SKELETON UI */}
            {isProtected ? (
                <div
                    className={`p-6 space-y-6 filter ${blurIntensity} pointer-events-none select-none transition-all duration-300`}
                    aria-hidden="true"
                >
                    {customSkeleton ? (
                        customSkeleton
                    ) : (
                        /* Bộ khung Skeleton mặc định nhấp nháy mô phỏng giao diện */
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Header Skeleton */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-20 rounded-lg" />
                                    <Skeleton className="h-9 w-20 rounded-lg" />
                                </div>
                            </div>

                            {/* Banner / Card chính */}
                            <Skeleton className="h-44 w-full rounded-2xl" />

                            {/* Các khối nội dung bên dưới */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Skeleton className="h-32 w-full rounded-xl" />
                                <Skeleton className="h-32 w-full rounded-xl" />
                                <Skeleton className="h-32 w-full rounded-xl" />
                            </div>

                            {/* Đoạn văn bản Skeleton */}
                            <div className="space-y-3 pt-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Khi đang xem bình thường: Hiển thị nội dung thật */
                <div className="transition-all duration-300">{children}</div>
            )}

            {/* LỚP OVERLAY THÔNG BÁO Ở CHÍNH GIỮA KHI ĐANG BẢO VỆ */}
            {isProtected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-3">
                        <span className="text-3xl block">🔒</span>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
                            {message}
                        </h3>
                        <p className="text-xs text-gray-500">
                            Nhấp chuột hoặc quay lại tab này để tiếp tục sử dụng.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}