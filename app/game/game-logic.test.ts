import { describe, it, expect } from "vitest";
import {
    tinhTongDiem,
    tinhKetQua,
    kiemTraCuocHopLe,
    tinhSoDuMoi,
    sinhXucXacThua,
} from "./game-logic";

describe("Bộ kiểm thử TDD cho Game", () => {
    // ----------------------------------------------------
    describe("1. Thuật toán tính tổng điểm", () => {
        it("Tính đúng tổng 3 viên xúc xắc [1, 2, 3] = 6", () => {
            expect(tinhTongDiem([1, 2, 3])).toBe(6);
        });

        it("Tính đúng tổng điểm tối thiểu [1, 1, 1] = 3", () => {
            expect(tinhTongDiem([1, 1, 1])).toBe(3);
        });

        it("Tính đúng tổng điểm tối đa [6, 6, 6] = 18", () => {
            expect(tinhTongDiem([6, 6, 6])).toBe(18);
        });
    });

    // ----------------------------------------------------
    describe("2. Thuật toán phân định Thắng / Thua", () => {
        it("Chọn Tài và ra tổng 14 (3-5-6) -> Người chơi thắng", () => {
            const ketQua = tinhKetQua([3, 5, 6], "Tài");
            expect(ketQua).toBe("Người chơi thắng");
        });

        it("Chọn Xỉu và ra tổng 7 (1-2-4) -> Người chơi thắng", () => {
            const ketQua = tinhKetQua([1, 2, 4], "Xỉu");
            expect(ketQua).toBe("Người chơi thắng");
        });

        it("Chọn Tài nhưng ra tổng 8 (2-3-3) -> Nhà cái thắng", () => {
            const ketQua = tinhKetQua([2, 3, 3], "Tài");
            expect(ketQua).toBe("Nhà cái thắng");
        });

        it("Chọn Xỉu nhưng ra tổng 12 (4-4-4 loại trừ bão, ví dụ 3-4-5) -> Nhà cái thắng", () => {
            const ketQua = tinhKetQua([3, 4, 5], "Xỉu");
            expect(ketQua).toBe("Nhà cái thắng");
        });

        it("LUẬT BÃO: Ra 3 con giống nhau [2, 2, 2], dù chọn Xỉu vẫn THUA (Nhà cái thắng)", () => {
            const ketQua = tinhKetQua([2, 2, 2], "Xỉu");
            expect(ketQua).toBe("Nhà cái thắng");
        });

        it("LUẬT BÃO: Ra 3 con giống nhau [5, 5, 5], dù chọn Tài vẫn THUA (Nhà cái thắng)", () => {
            const ketQua = tinhKetQua([5, 5, 5], "Tài");
            expect(ketQua).toBe("Nhà cái thắng");
        });

        it("Chưa chọn cửa thì trả về 'Chưa xắc'", () => {
            const ketQua = tinhKetQua([1, 2, 3], "");
            expect(ketQua).toBe("Chưa xắc");
        });
    });

    // ----------------------------------------------------
    describe("3. Thuật toán kiểm tra tiền cược hợp lệ", () => {
        it("Cược số tiền hợp lệ (nhỏ hơn hoặc bằng số dư)", () => {
            const check = kiemTraCuocHopLe(100000, 20000);
            expect(check.valid).toBe(true);
        });

        it("Báo lỗi nếu cược 0 xu hoặc số âm", () => {
            const check0 = kiemTraCuocHopLe(100000, 0);
            expect(check0.valid).toBe(false);
            expect(check0.error).toBe("Số tiền cược phải lớn hơn 0!");

            const checkAm = kiemTraCuocHopLe(100000, -5000);
            expect(checkAm.valid).toBe(false);
        });

        it("Báo lỗi nếu đặt cược vượt quá số dư hiện có", () => {
            const check = kiemTraCuocHopLe(50000, 100000);
            expect(check.valid).toBe(false);
            expect(check.error).toBe("Số dư không đủ để đặt cược!");
        });
    });

    // ----------------------------------------------------
    describe("4. Thuật toán cộng / trừ tiền cược", () => {
        it("Khi người chơi thắng: cộng thêm đúng số tiền cược vào ví", () => {
            const soDuMoi = tinhSoDuMoi(100000, 30000, "Người chơi thắng");
            expect(soDuMoi).toBe(130000);
        });

        it("Khi nhà cái thắng: trừ đúng số tiền cược khỏi ví", () => {
            const soDuMoi = tinhSoDuMoi(100000, 30000, "Nhà cái thắng");
            expect(soDuMoi).toBe(70000);
        });
    });

    // ----------------------------------------------------
    describe("5. Thuật toán 'Bịp' (Ép người chơi thua)", () => {
        it("Người chơi chọn Tài: hàm bịp luôn tạo ra tổng điểm thuộc cửa Xỉu (4..10)", () => {
            // Chạy thử 50 lần ngẫu nhiên để kiểm chứng
            for (let i = 0; i < 50; i++) {
                const dice = sinhXucXacThua("Tài");
                const sum = tinhTongDiem(dice);
                expect(sum).toBeGreaterThanOrEqual(4);
                expect(sum).toBeLessThanOrEqual(10);
            }
        });

        it("Người chơi chọn Xỉu: hàm bịp luôn tạo ra tổng điểm thuộc cửa Tài (11..17)", () => {
            // Chạy thử 50 lần ngẫu nhiên để kiểm chứng
            for (let i = 0; i < 50; i++) {
                const dice = sinhXucXacThua("Xỉu");
                const sum = tinhTongDiem(dice);
                expect(sum).toBeGreaterThanOrEqual(11);
                expect(sum).toBeLessThanOrEqual(17);
            }
        });
    });
});
