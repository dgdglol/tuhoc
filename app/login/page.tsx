'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface AuthUser {
    username: string;
    role: "guest" | "user" | "admin";
    balance?: number;
}

// Chỗ lưu duy nhất trên trình duyệt dùng chung cho cả /login, /game và GlobalBlurGuard
export const AUTH_STORAGE_KEY = "lamcv_auth_user";
export const AUTH_CHANGE_EVENT = "lamcv-auth-change";

// Hàm tiện ích lưu/xoá phiên đăng nhập đồng bộ toàn hệ thống
export function saveAuthUser(user: AuthUser | null) {
    if (typeof window === "undefined") return;
    if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

interface LoginPageProps {
    /** Khi được nhúng trong GlobalBlurGuard thì hiển thị dạng Modal nổi, không bọc nền xám toàn trang */
    isModal?: boolean;
    /** Callback báo cho GlobalBlurGuard biết đã đăng nhập xong */
    onLoginSuccess?: (user: AuthUser) => void;
}

export default function LoginPage({ isModal = false, onLoginSuccess }: LoginPageProps = {}) {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Thuật toán đăng nhập duy nhất dùng chung cho cả /login và GlobalBlurGuard
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Đăng nhập thất bại!");
                return;
            }

            const user: AuthUser = {
                username: data.user.username,
                role: data.user.role || "user",
                balance: data.user.balance ?? 0,
            };

            // luu vo 1 cho
            saveAuthUser(user);
            setUsername("");
            setPassword("");

            if (onLoginSuccess) {
                onLoginSuccess(user);
            } else {
                router.push("/nghichlinhtinh");
            }
        } catch {
            setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Đăng nhập nhanh vai trò Khách (Guest)
    const handleGuestLogin = () => {
        const guestUser: AuthUser = {
            username: "Khách vãng lai",
            role: "guest",
            balance: 0,
        };
        saveAuthUser(guestUser);
        setError("");

        if (onLoginSuccess) {
            onLoginSuccess(guestUser);
        } else {
            router.push("/nghichlinhtinh");
        }
    };

    // Điền nhanh tài khoản mẫu trong data/users.json
    const quickFill = (u: string, p: string) => {
        setUsername(u);
        setPassword(p);
        setError("");
    };

    const formCard = (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-1.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl mb-1 shadow-xs">
                    🔐
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Đăng Nhập Hệ Thống
                </h2>
                <p className="text-xs text-gray-500">
                    Xác thực qua <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">/api/auth/login</code> &amp; lưu chung tại <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">data/users.json</code>
                </p>
            </div>

            {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                    <label
                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                        htmlFor="username"
                    >
                        Tên Đăng Nhập
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên đăng nhập..."
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
                <div>
                    <label
                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                        htmlFor="password"
                    >
                        Mật Khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-sm rounded-xl shadow-md transition duration-150 cursor-pointer"
                >
                    {isSubmitting ? "Đang kiểm tra tài khoản..." : "Đăng Nhập"}
                </button>
            </form>

            {/* Vào nhanh bằng Khách (Guest) */}
            <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 dark:border-gray-700 w-full"></div>
                <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] text-gray-400 uppercase font-semibold">
                    Hoặc
                </span>
            </div>

            <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium text-xs rounded-xl transition cursor-pointer"
            >
                🚀 Vào nhanh với vai trò Khách (Guest)
            </button>

            {/* Tài khoản mẫu trong data/users.json */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 space-y-1.5">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                    ⚡ Điền nhanh tài khoản trong data/users.json:
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => quickFill("dung123", "dung123")}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg cursor-pointer transition"
                    >
                        👑 Admin: <span className="font-mono font-bold">dung123</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => quickFill("testuser", "password123")}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg cursor-pointer transition"
                    >
                        👤 User: <span className="font-mono font-bold">testuser</span>
                    </button>
                </div>
            </div>

            <p className="text-center text-xs text-gray-600 pt-1">
                Chưa có tài khoản?{" "}
                <Link href="/login/register" className="text-indigo-600 font-semibold hover:underline">
                    Đăng ký tại đây
                </Link>
            </p>
        </div>
    );

    if (isModal) {
        return formCard;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {formCard}
        </div>
    );
}
