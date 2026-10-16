"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Thuattoan from "./thuattoan";
import {
    AUTH_STORAGE_KEY,
    AUTH_CHANGE_EVENT,
    saveAuthUser,
    AuthUser,
} from "@/app/login/page";

export interface UserAccount {
    username: string;
    balance: number;
    role?: "guest" | "user" | "admin";
}

export default function Taixiu() {
    const [choice, setChoice] = useState<"Tài" | "Xỉu" | "">("");
    const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

    // Đọc thông tin user hiện tại từ cùng 1 chỗ lưu với /login và GlobalBlurGuard
    useEffect(() => {
        const syncUser = () => {
            const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (savedUser) {
                try {
                    const parsed: AuthUser = JSON.parse(savedUser);
                    setCurrentUser({
                        username: parsed.username,
                        balance: parsed.balance ?? 0,
                        role: parsed.role,
                    });
                } catch (e) {
                    console.error("Lỗi đọc user:", e);
                }
            } else {
                setCurrentUser(null);
            }
        };

        syncUser();
        window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
        window.addEventListener("storage", syncUser);
        return () => {
            window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    // Hàm cập nhật số dư của user cả ở state và localStorage dùng chung
    const handleUpdateBalance = (newBalance: number) => {
        if (!currentUser) return;

        const updatedUser: UserAccount = { ...currentUser, balance: newBalance };
        setCurrentUser(updatedUser);
        saveAuthUser({
            username: updatedUser.username,
            role: updatedUser.role || "user",
            balance: newBalance,
        });
    };

    // Đăng xuất
    const handleLogout = () => {
        saveAuthUser(null);
        setCurrentUser(null);
    };

    // Nạp thêm xu cứu trợ khi hết tiền
    const handleRefill = () => {
        if (!currentUser) return;
        handleUpdateBalance(currentUser.balance + 50000);
        alert("Đã nhận 50.000 xu cứu trợ! Chúc bạn may mắn lần này.");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-slate-50 text-gray-800">
            {/* Thanh thông tin tài khoản phía trên */}
            <div className="w-full max-w-lg mb-6 px-4">
                {currentUser ? (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm text-gray-500">Người chơi</p>
                            <p className="font-bold text-gray-800 text-lg">👤 {currentUser.username}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Số dư hiện có</p>
                            <p className="font-bold text-green-600 text-xl">
                                💰 {currentUser.balance.toLocaleString()} xu
                            </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {currentUser.balance <= 10000 && (
                                <button
                                    onClick={handleRefill}
                                    className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium rounded shadow transition"
                                >
                                    + Cứu trợ 50k
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded transition"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
                        <p className="text-amber-800 font-medium text-sm mb-2">
                            ⚠️ Bạn đang chơi ở chế độ khách (Chưa lưu xu & kết quả).
                        </p>
                        <div className="flex justify-center gap-3">
                            <Link
                                href="/login"
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
                            >
                                Đăng Nhập
                            </Link>
                            <Link
                                href="/login/register"
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow transition"
                            >
                                Đăng Ký (+100k xu)
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Game</h1>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <h3 className="text-lg">
                    Bạn chọn: <strong className={choice === "Tài" ? "text-green-600" : choice === "Xỉu" ? "text-red-600" : "text-gray-500"}>
                        {choice || "Chưa chọn"}
                    </strong>
                </h3>
            </div>

            {/* Nút chọn Tài / Xỉu */}
            <div style={{ display: "flex", gap: "20px" }}>
                <button
                    type="button"
                    onClick={() => setChoice("Tài")}
                    className={`px-8 py-3 text-lg font-bold rounded-xl text-white transition transform active:scale-95 shadow ${
                        choice === "Tài"
                            ? "bg-green-600 ring-4 ring-green-300"
                            : "bg-green-500 hover:bg-green-600 opacity-90"
                    }`}
                >
                    Tài (11 - 17)
                </button>
                <button
                    type="button"
                    onClick={() => setChoice("Xỉu")}
                    className={`px-8 py-3 text-lg font-bold rounded-xl text-white transition transform active:scale-95 shadow ${
                        choice === "Xỉu"
                            ? "bg-red-600 ring-4 ring-red-300"
                            : "bg-red-500 hover:bg-red-600 opacity-90"
                    }`}
                >
                    Xỉu (4 - 10)
                </button>
            </div>

            {/* Component thuật toán lắc xúc xắc */}
            <Thuattoan
                choice={choice}
                currentUser={currentUser}
                onUpdateBalance={handleUpdateBalance}
            />
        </div>
    );
}