'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginPage, {
  AuthUser,
  AUTH_STORAGE_KEY,
  AUTH_CHANGE_EVENT,
  saveAuthUser,
} from '@/app/login/page';

export type { AuthUser };

interface GlobalBlurGuardProps {
  children: React.ReactNode;
  /** Mức độ làm mờ CSS (mặc định: blur-md) */
  blurIntensity?: string;
  /** Cho phép tuỳ biến Skeleton nếu muốn */
  customSkeleton?: React.ReactNode;
}

export default function GlobalBlurGuard({
  children,
  blurIntensity = 'blur-md',
}: GlobalBlurGuardProps) {
  const pathname = usePathname();

  // Trạng thái tài khoản người dùng (đọc cùng 1 chỗ với /login)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Trạng thái bảo vệ khi chuyển tab
  const [isTabHidden, setIsTabHidden] = useState(false);

  // Nếu người dùng đang đứng trực tiếp ở trang /login hoặc /login/register thì không khóa đè lên nữa
  const isAuthRoute = pathname?.startsWith('/login');

  // 1. Đọc & đồng bộ tài khoản từ cùng 1 key localStorage với trang /login
  useEffect(() => {
    const syncAuthFromStorage = () => {
      try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch (e) {
        console.error('Lỗi đọc session:', e);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    syncAuthFromStorage();

    // Lắng nghe khi trang /login, /login/register hoặc tab khác thay đổi trạng thái đăng nhập
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuthFromStorage);
    window.addEventListener('storage', syncAuthFromStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuthFromStorage);
      window.removeEventListener('storage', syncAuthFromStorage);
    };
  }, []);

  // 2. Lắng nghe sự kiện chuyển tab / ẩn màn hình
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.visibilityState !== 'visible');
    };

    const handleBlur = () => setIsTabHidden(true);
    const handleFocus = () => setIsTabHidden(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Đăng xuất (xoá ở cùng 1 chỗ lưu và khoá mờ lại màn hình)
  const handleLogout = () => {
    saveAuthUser(null);
    setCurrentUser(null);
  };

  // Màn hình bị khoá nếu: không phải trang /login VÀ (chưa đăng nhập HOẶC đang rời tab)
  const isLocked = !isAuthRoute && (!currentUser || isTabHidden);

  return (
    <div className="relative min-h-screen w-full">
      {/* 1. NỘI DUNG CHÍNH */}
      <div
        className={`transition-all duration-500 ${
          isLocked
            ? `filter ${blurIntensity} pointer-events-none select-none opacity-40 scale-[0.99] origin-top`
            : ''
        }`}
        aria-hidden={isLocked}
      >
        {children}
      </div>

      {/* 2. THANH BÁO VAI TRÒ & NÚT ĐĂNG XUẤT (KHI ĐÃ ĐĂNG NHẬP) */}
      {currentUser && !isTabHidden && (
        <div className="fixed top-3 right-4 z-40 flex items-center gap-3 bg-white/90 backdrop-blur-md border border-gray-200 shadow-md px-3.5 py-1.5 rounded-full text-xs animate-in fade-in">
          <span className="flex items-center gap-1.5 font-medium text-gray-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            👤 {currentUser.username}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              currentUser.role === 'admin'
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : currentUser.role === 'user'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}
          >
            {currentUser.role}
          </span>
          <button
            onClick={handleLogout}
            title="Đăng xuất để khoá lại màn hình"
            className="text-gray-400 hover:text-rose-600 transition font-medium cursor-pointer pl-1 border-l border-gray-200"
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* 3. LỚP OVERLAY BẢO VỆ KHI RỜI TAB (PRIVACY SCREEN) */}
      {currentUser && isTabHidden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-3 animate-in fade-in">
            <span className="text-3xl block">🔒</span>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
              Nội dung đang được ẩn để bảo mật
            </h3>
            <p className="text-xs text-gray-500">
              Nhấp chuột hoặc quay lại tab này để tiếp tục làm việc.
            </p>
          </div>
        </div>
      )}

      {/* 4. HIỂN THỊ TRỰC TIẾP COMPONENT <LoginPage /> CỦA TRANG /login KHI CHƯA ĐĂNG NHẬP */}
      {!isAuthRoute && !currentUser && !isLoadingAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-in fade-in duration-300">
          <LoginPage
            isModal
            onLoginSuccess={(user) => setCurrentUser(user)}
          />
        </div>
      )}
    </div>
  );
}