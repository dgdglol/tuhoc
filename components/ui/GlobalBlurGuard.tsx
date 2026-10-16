'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginPage, {
  AuthUser,
  AUTH_STORAGE_KEY,
  AUTH_CHANGE_EVENT,
  saveAuthUser,
} from '@/app/login/page';

export type { AuthUser };

interface UserDataRecord {
  id: number;
  username: string;
  password?: string;
  role?: string;
  balance?: number;
  createdAt?: string;
}

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
  const pathname = usePathname() || '/';

  // Trạng thái tài khoản người dùng (đọc cùng 1 chỗ với /login)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Trạng thái bảo vệ khi chuyển tab
  const [isTabHidden, setIsTabHidden] = useState(false);

  // Cho phép mở form đăng nhập để đổi tài khoản ngay khi bị chặn quyền
  const [showSwitchAccountModal, setShowSwitchAccountModal] = useState(false);

  // Modal xem dữ liệu người dùng dành riêng cho Admin
  const [showAdminDataModal, setShowAdminDataModal] = useState(false);
  const [usersData, setUsersData] = useState<UserDataRecord[]>([]);
  const [loadingUsersData, setLoadingUsersData] = useState(false);

  // Nếu người dùng đang đứng trực tiếp ở trang /login hoặc /login/register thì không khóa đè lên nữa
  const isAuthRoute = pathname.startsWith('/login');

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

  // Hàm tải danh sách data/users.json (chỉ gọi khi là Admin)
  const fetchAllUsersForAdmin = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setLoadingUsersData(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsersData(data.users);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách người dùng:', e);
    } finally {
      setLoadingUsersData(false);
    }
  };

  const handleOpenAdminData = () => {
    setShowAdminDataModal(true);
    fetchAllUsersForAdmin();
  };

  // Đăng xuất (xoá ở cùng 1 chỗ lưu và khoá mờ lại màn hình)
  const handleLogout = () => {
    saveAuthUser(null);
    setCurrentUser(null);
    setShowAdminDataModal(false);
    setShowSwitchAccountModal(false);
  };

  // --- KIỂM TRA PHÂN QUYỀN THEO VAI TRÒ (ROLE) ---
  // 1) Guest: Chỉ được xem duy nhất trang CV ('/')
  const isGuestBlocked =
    !isAuthRoute && currentUser?.role === 'guest' && pathname !== '/';

  // 2) User: Xem được CV và các dự án, NHƯNG không được vào trang quản trị / data người dùng (/dashboardpage)
  const isUserBlocked =
    !isAuthRoute &&
    currentUser?.role === 'user' &&
    pathname.startsWith('/dashboardpage');

  const isRoleBlocked = isGuestBlocked || isUserBlocked;

  // Màn hình bị khoá mờ nếu: không phải trang /login VÀ (chưa đăng nhập, HOẶC đang rời tab, HOẶC không đủ quyền, HOẶC đang mở modal đổi tài khoản)
  const isLocked =
    !isAuthRoute &&
    (!currentUser || isTabHidden || isRoleBlocked || showSwitchAccountModal);

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

      {/* 2. THANH BÁO VAI TRÒ, NÚT DATA ADMIN & NÚT ĐĂNG XUẤT (KHI ĐÃ ĐĂNG NHẬP) */}
      {currentUser && !isTabHidden && (
        <div className="fixed top-3 right-4 z-40 flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-gray-200 shadow-md px-3.5 py-1.5 rounded-full text-xs animate-in fade-in">
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

          {/* Nút chỉ hiện cho ADMIN để xem toàn bộ data người dùng */}
          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={handleOpenAdminData}
              className="px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full font-semibold transition cursor-pointer"
            >
              📊 Data người dùng
            </button>
          )}

          <button
            onClick={handleLogout}
            title="Đăng xuất để khoá lại màn hình"
            className="text-gray-400 hover:text-rose-600 transition font-medium cursor-pointer pl-1.5 border-l border-gray-200"
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

      {/* 4. MODAL CHẶN KHI KHÔNG ĐỦ QUYỀN (GUEST VÀO TRANG KHÁC CV HOẶC USER VÀO TRANG ADMIN) */}
      {!isTabHidden && currentUser && isRoleBlocked && !showSwitchAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 text-2xl mx-auto">
              {isGuestBlocked ? '🔒' : '⛔'}
            </div>

            {isGuestBlocked ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Giới hạn quyền Khách (Guest)
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Bạn đang truy cập với vai trò{' '}
                  <strong className="text-amber-600 uppercase">Guest</strong>. Vai trò này{' '}
                  <strong>chỉ được phép xem trang CV cá nhân</strong>. Vui lòng đăng nhập tài khoản{' '}
                  <strong>User</strong> hoặc <strong>Admin</strong> để mở khoá các dự án và tính năng khác!
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Khu vực chỉ dành cho Admin
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Tài khoản <strong className="text-blue-600">{currentUser.username}</strong> có vai trò{' '}
                  <strong className="text-blue-600 uppercase">User</strong> nên{' '}
                  <strong>không được phép xem dữ liệu người dùng và bảng quản trị</strong>. Chỉ{' '}
                  <strong className="text-rose-600 uppercase">Admin</strong> mới có quyền truy cập khu vực này.
                </p>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/"
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
              >
                ← Quay về trang CV
              </Link>
              <button
                type="button"
                onClick={() => setShowSwitchAccountModal(true)}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition cursor-pointer"
              >
                🔐 Đăng nhập tài khoản khác
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. HIỂN THỊ TRỰC TIẾP COMPONENT <LoginPage /> KHI CHƯA ĐĂNG NHẬP HOẶC BẤM ĐỔI TÀI KHOẢN */}
      {!isAuthRoute && (!currentUser || showSwitchAccountModal) && !isLoadingAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md flex justify-center">
            {showSwitchAccountModal && currentUser && (
              <button
                type="button"
                onClick={() => setShowSwitchAccountModal(false)}
                className="absolute -top-3 -right-2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md text-gray-500 hover:text-gray-800 flex items-center justify-center text-sm font-bold cursor-pointer"
                title="Đóng"
              >
                ✕
              </button>
            )}
            <LoginPage
              isModal
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                setShowSwitchAccountModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 6. MODAL XEM DATA NGƯỜI DÙNG (CHỈ DÀNH CHO ADMIN) */}
      {currentUser?.role === 'admin' && showAdminDataModal && !isTabHidden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full mb-1">
                  👑 Quyền Admin
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Dữ liệu toàn bộ người dùng (data/users.json)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchAllUsersForAdmin}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition cursor-pointer"
                >
                  🔄 Làm mới
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminDataModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition cursor-pointer"
                >
                  Đóng ✕
                </button>
              </div>
            </div>

            <div className="overflow-auto flex-1">
              {loadingUsersData ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  ⏳ Đang tải dữ liệu người dùng...
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase text-[11px]">
                      <th className="py-2.5 px-3 font-semibold">ID</th>
                      <th className="py-2.5 px-3 font-semibold">Tài khoản</th>
                      <th className="py-2.5 px-3 font-semibold">Mật khẩu</th>
                      <th className="py-2.5 px-3 font-semibold">Vai trò (Role)</th>
                      <th className="py-2.5 px-3 font-semibold">Điểm tích lũy</th>
                      <th className="py-2.5 px-3 font-semibold">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersData.map((u) => (
                      <tr key={u.id || u.username} className="hover:bg-gray-50/80">
                        <td className="py-2.5 px-3 font-mono text-gray-400">
                          {u.id}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-gray-800">
                          👤 {u.username}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-gray-600">
                          {u.password}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-600">
                          {(u.balance ?? 0).toLocaleString()} điểm
                        </td>
                        <td className="py-2.5 px-3 text-gray-500">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleString('vi-VN')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Tổng số tài khoản đã đăng ký: <strong>{usersData.length}</strong></span>
              <Link
                href="/dashboardpage"
                onClick={() => setShowAdminDataModal(false)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Mở trang Quản trị Admin (/dashboardpage) →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}