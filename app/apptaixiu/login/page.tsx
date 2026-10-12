"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            return;
        }

        try {
            // Dùng FETCH gọi API kiểm tra tài khoản từ file data/users.json trên máy
            const res = await fetch("/apptaixiu/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Tên đăng nhập hoặc mật khẩu không chính xác!");
                return;
            }

            // Lưu thông tin người dùng hiện tại
            localStorage.setItem("taixiu_currentUser", JSON.stringify(data.user));

            // Chuyển về trang game
            router.push("/apptaixiu");
        } catch (err) {
            setError("Lỗi kết nối máy chủ, vui lòng thử lại!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Đăng Nhập</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Đăng nhập để tiếp tục chơi Game và giữ số dư xu!
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên tài khoản..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
                    >
                        Đăng Nhập
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link href="/apptaixiu/register" className="text-blue-600 font-medium hover:underline">
                        Đăng ký nhận 100.000 xu ngay
                    </Link>
                </div>

                <div className="mt-2 text-center text-sm">
                    <Link href="/apptaixiu" className="text-gray-500 hover:text-gray-700 text-xs">
                        ← Quay lại game (Chơi thử)
                    </Link>
                </div>
            </div>
        </div>
    );
}
