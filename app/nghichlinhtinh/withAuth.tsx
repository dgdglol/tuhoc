'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  role: 'admin' | 'user';
}

export type AuthRole = 'guest' | 'user' | 'admin';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  currentRole: AuthRole;
  switchRole: (role: AuthRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<AuthRole>('admin');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const applyRole = (role: AuthRole) => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (role === 'guest') {
        setUser(null);
      } else if (role === 'user') {
        setUser({ name: 'Khách hàng Demo', role: 'user' });
      } else {
        setUser({ name: 'Bùi Vũ Dũng', role: 'admin' });
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const cleanup = applyRole(currentRole);
    return cleanup;
  }, [currentRole]);

  const switchRole = (newRole: AuthRole) => {
    setCurrentRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        currentRole,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// UI điều khiển phân quyền trực quan cho trang demo
export const AuthRoleSwitcher: React.FC = () => {
  const { currentRole, switchRole, loading, user } = useAuth();

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-slate-700 text-sm">
          🎛️ Bộ chuyển đổi vai trò (Role Switcher Live Demo):
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full font-mono font-medium bg-white border border-slate-200 text-slate-600">
          Trạng thái: {loading ? '⏳ Đang xác thực...' : user ? `✅ ${user.name} (${user.role})` : '❌ Chưa đăng nhập'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => switchRole('guest')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentRole === 'guest'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          🚫 Chưa đăng nhập (Guest)
        </button>
        <button
          type="button"
          onClick={() => switchRole('user')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentRole === 'user'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          👤 Người dùng thường (User)
        </button>
        <button
          type="button"
          onClick={() => switchRole('admin')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            currentRole === 'admin'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          👑 Quản trị viên (Admin)
        </button>
      </div>
    </div>
  );
};

// --- AUTHENTICATION HOC ---
// HOC kiểm tra xem người dùng đã đăng nhập chưa
export function withAuthentication<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAuthentication = (props: P) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 flex items-center gap-2 animate-pulse">
          <span className="animate-spin">⏳</span>
          <span>Đang kiểm tra thông tin đăng nhập (Authentication)...</span>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-xs">
          <strong>Authentication (Xác thực thất bại):</strong> Bạn chưa đăng nhập. Vui lòng đăng nhập để xem nội dung này.
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthentication.displayName = `WithAuthentication(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthentication;
}

// --- AUTHORIZATION HOC ---
// HOC kiểm tra xem người dùng có quyền (role) phù hợp không
export function withAuthorization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) {
  const WithAuthorization = (props: P) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 flex items-center gap-2 animate-pulse">
          <span className="animate-spin">⏳</span>
          <span>Đang kiểm tra quyền truy cập (Authorization)...</span>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg shadow-xs">
          <strong>Authorization (Phân quyền thất bại):</strong> Bạn chưa đăng nhập.
        </div>
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return (
        <div className="p-4 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg shadow-xs">
          <strong>Authorization (Phân quyền thất bại):</strong> Bạn ({user.name} - vai trò: <code>{user.role}</code>) không có quyền truy cập khu vực này. Cần quyền: {allowedRoles.join(', ')}.
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthorization.displayName = `WithAuthorization(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthorization;
}
