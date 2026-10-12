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

    const handleRegister = (e: React.FormEvent) => {
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

        // 2. Lấy danh sách users từ localStorage
        const existingUsers = JSON.parse(localStorage.getItem("taixiu_users") || "[]");

        // 3. Kiểm tra xem username đã tồn tại chưa
        const userExists = existingUsers.some(
            (u: { username: string }) => u.username.toLowerCase() === username.trim().toLowerCase()
        );

        if (userExists) {
            setError("Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!");
            return;
        }

        // 4. Tạo user mới với số dư tặng ban đầu (100.000 xu)
        const newUser = {
            username: username.trim(),
            password: password, // Chú ý: Đây là demo localStorage để học, thực tế cần hash ở backend
            balance: 100000,
            createdAt: new Date().toISOString(),
        };

        // 5. Lưu vào danh sách users
        existingUsers.push(newUser);
        localStorage.setItem("taixiu_users", JSON.stringify(existingUsers));

        // Tự động đăng nhập luôn cho user mới
        localStorage.setItem("taixiu_currentUser", JSON.stringify(newUser));

        setSuccess("Đăng ký thành công! Tặng bạn 100.000 xu khởi nghiệp. Đang vào game...");

        // Chuyển hướng về trang game Tài Xỉu sau 1.5 giây
        setTimeout(() => {
            router.push("/game");
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Đăng Ký Tài Khoản</h1>
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
                    <Link href="/game/login" className="text-blue-600 font-medium hover:underline">
                        Đăng nhập ngay
                    </Link>
                </div>

                <div className="mt-2 text-center text-sm">
                    <Link href="/game" className="text-gray-500 hover:text-gray-700 text-xs">
                        ← Quay lại game (Chơi thử)
                    </Link>
                </div>
            </div>
        </div>
    );
}
