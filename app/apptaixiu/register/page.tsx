"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // 1. Kiểm tra dữ liệu nhập vào (Validate)
        if (!username.trim() || !password.trim()) {
            setError("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không trùng khớp!");
            return;
        }

        try {
            // 2. Dùng FETCH gửi dữ liệu lên Server API (/apptaixiu/api/register)
            // Server sẽ tự động ghi tài khoản này vào file 'data/users.json' trên máy của bạn!
            const res = await fetch("/apptaixiu/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Đăng ký thất bại!");
                return;
            }

            // 3. Đăng ký thành công -> Lưu người dùng hiện tại vào localStorage để chơi game
            localStorage.setItem("taixiu_currentUser", JSON.stringify(data.user));

            setSuccess("🎉 Đăng ký thành công! Dữ liệu đã được lưu vào ổ cứng (data/users.json). Đang vào game...");

            // Chuyển hướng về trang Game
            setTimeout(() => {
                router.push("/apptaixiu");
            }, 1500);
        } catch (err) {
            setError("Lỗi kết nối máy chủ, vui lòng thử lại!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Đăng Ký Tài Khoản</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Tạo tài khoản chơi Game và nhận ngay <span className="font-semibold text-green-600">100.000 xu</span>!
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 text-sm rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập..."
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
                            placeholder="Tối thiểu 6 ký tự..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
                    >
                        Tạo Tài Khoản
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link href="/apptaixiu/login" className="text-blue-600 font-medium hover:underline">
                        Đăng nhập ngay
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
