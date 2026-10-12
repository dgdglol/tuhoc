"use client";

import React, { useEffect, useState } from "react";
import { UserAccount } from "./page";
import {
    DiceValue,
    Choice,
    Result,
    tinhTongDiem,
    tinhKetQua,
    kiemTraCuocHopLe,
    tinhSoDuMoi,
    sinhXucXacThua,
} from "./game-logic";

interface ThuattoanProps {
    choice?: Choice;
    currentUser?: UserAccount | null;
    onUpdateBalance?: (newBalance: number) => void;
}

export default function Thuattoan({ choice, currentUser, onUpdateBalance }: ThuattoanProps) {
    // lưu kết quả xúc xắc
    const [dice, setDice] = useState<DiceValue[]>([1, 1, 1]);
    const [total, setTotal] = useState<number>(3);
    const [result, setResult] = useState<Result>('Chưa xắc');
    const [betAmount, setBetAmount] = useState<number>(10000);
    const [lastDelta, setLastDelta] = useState<number | null>(null);

    const [playerCount, setPlayerCount] = useState<number>(0);

    useEffect(() => {
        const saveCount = localStorage.getItem('playerCount');
        if (saveCount) {
            setPlayerCount(parseInt(saveCount, 10));
        }
    }, []);

    // Hàm tạo 1 viên xúc xắc ngẫu nhiên
    const getRandom = (): DiceValue => {
        return (Math.floor(Math.random() * 6) + 1) as DiceValue;
    };

    const handleRoll = () => {
        if (!choice) {
            alert("Vui lòng chọn Tài hoặc Xỉu trước khi lắc!");
            return;
        }

        // Nếu đã đăng nhập, kiểm tra tiền cược bằng hàm đã được test TDD
        if (currentUser) {
            const check = kiemTraCuocHopLe(currentUser.balance, betAmount);
            if (!check.valid) {
                alert(check.error);
                return;
            }
        }

        const newCount = playerCount + 1;
        setPlayerCount(newCount);
        localStorage.setItem('playerCount', newCount.toString());

        let d1: DiceValue, d2: DiceValue, d3: DiceValue;

        // Cứ mỗi 6 lượt (lượt 6, 12, 18,...) thì bịp cho người chơi thua
        const isBip = newCount % 6 === 0;

        if (isBip) {
            [d1, d2, d3] = sinhXucXacThua(choice);
        } else {
            d1 = getRandom();
            d2 = getRandom();
            d3 = getRandom();
        }

        const currentDice: DiceValue[] = [d1, d2, d3];
        const sum = tinhTongDiem(currentDice);
        const roundResult = tinhKetQua(currentDice, choice);

        setDice(currentDice);
        setTotal(sum);
        setResult(roundResult);

        // Cộng / Trừ tiền cược bằng hàm đã test TDD
        if (currentUser && onUpdateBalance) {
            const newBal = tinhSoDuMoi(currentUser.balance, betAmount, roundResult);
            onUpdateBalance(newBal);
            setLastDelta(roundResult === 'Người chơi thắng' ? betAmount : -betAmount);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-md px-4">
            {/* Khu vực đặt cược (nếu đã đăng nhập) */}
            {currentUser && (
                <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Chọn mức cược (xu):</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {[10000, 20000, 50000, 100000].map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => setBetAmount(amt)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                    betAmount === amt
                                        ? "bg-blue-600 text-white shadow"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                            >
                                {amt.toLocaleString()}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setBetAmount(currentUser.balance)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition"
                        >
                            Tất tay
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500">Cược:</span>
                        <input
                            type="number"
                            min="1000"
                            step="1000"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            className="w-36 px-2 py-1 text-center font-bold text-gray-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500">xu</span>
                    </div>
                </div>
            )}

            {/* Nút lắc xúc xắc */}
            <button
                type="button"
                onClick={handleRoll}
                className="w-full max-w-xs py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-lg rounded-xl shadow-md transition duration-150"
            >
                🎲 Lắc xúc xắc
            </button>

            {/* Kết quả ván chơi */}
            <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center">
                <p className="text-xs text-gray-400 mb-1">Số lượt chơi: {playerCount}</p>
                <div className="flex justify-center items-center gap-3 my-2">
                    {dice.map((d, index) => (
                        <div
                            key={index}
                            className="w-12 h-12 flex items-center justify-center text-2xl font-bold bg-gray-100 border-2 border-gray-300 rounded-lg shadow-inner text-gray-800"
                        >
                            {d}
                        </div>
                    ))}
                </div>
                <h3 className="text-lg text-gray-700">
                    Tổng điểm: <strong className="text-xl text-blue-600">{total}</strong>
                </h3>

                <h3 className={`text-2xl font-extrabold mt-3 ${
                    result === 'Người chơi thắng'
                        ? 'text-green-600'
                        : result === 'Nhà cái thắng'
                        ? 'text-red-600'
                        : 'text-gray-500'
                }`}>
                    {result}
                </h3>

                {currentUser && lastDelta !== null && result !== 'Chưa xắc' && (
                    <p className={`mt-1 font-semibold text-sm ${lastDelta > 0 ? "text-green-600" : "text-red-600"}`}>
                        {lastDelta > 0 ? `+${lastDelta.toLocaleString()} xu 🤑` : `${lastDelta.toLocaleString()} xu 💸`}
                    </p>
                )}
            </div>
        </div>
    );
}