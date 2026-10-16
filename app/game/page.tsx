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

export default function DiceGame() {
    const [choice, setChoice] = useState<"Cao" | "Thấp" | "">("");
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

    // Nhận thêm điểm hỗ trợ khi hết điểm
    const handleRefill = () => {
        if (!currentUser) return;
        handleUpdateBalance(currentUser.balance + 50000);
        alert("Đã nhận thêm 50.000 điểm hỗ trợ! Chúc bạn chơi vui vẻ.");
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
                            <p className="text-sm text-gray-500">Điểm hiện có</p>
                            <p className="font-bold text-green-600 text-xl">
                                ⭐ {currentUser.balance.toLocaleString()} điểm
                            </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {currentUser.balance <= 10000 && (
                                <button
                                    onClick={handleRefill}
                                    className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium rounded shadow transition"
                                >
                                    + Nhận 50k điểm
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
                            ⚠️ Bạn đang ở chế độ khách (Chưa lưu điểm &amp; kết quả).
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
                                Đăng Ký (+100k điểm)
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Trò Chơi Xúc Xắc</h1>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <h3 className="text-lg">
                    Dự đoán của bạn:{" "}
                    <strong className={choice === "Cao" ? "text-green-600" : choice === "Thấp" ? "text-blue-600" : "text-gray-500"}>
                        {choice || "Chưa chọn"}
                    </strong>
                </h3>
            </div>

            {/* Nút chọn Cao / Thấp */}
            <div style={{ display: "flex", gap: "20px" }}>
                <button
                    type="button"
                    onClick={() => setChoice("Cao")}
                    className={`px-8 py-3 text-lg font-bold rounded-xl text-white transition transform active:scale-95 shadow ${
                        choice === "Cao"
                            ? "bg-green-600 ring-4 ring-green-300"
                            : "bg-green-500 hover:bg-green-600 opacity-90"
                    }`}
                >
                    Cao (11 - 17)
                </button>
                <button
                    type="button"
                    onClick={() => setChoice("Thấp")}
                    className={`px-8 py-3 text-lg font-bold rounded-xl text-white transition transform active:scale-95 shadow ${
                        choice === "Thấp"
                            ? "bg-blue-600 ring-4 ring-blue-300"
                            : "bg-blue-500 hover:bg-blue-600 opacity-90"
                    }`}
                >
                    Thấp (4 - 10)
                </button>
            </div>

            {/* Component thuật toán tung xúc xắc */}
            <Thuattoan
                choice={choice}
                currentUser={currentUser}
                onUpdateBalance={handleUpdateBalance}
            />
        </div>
    );
}