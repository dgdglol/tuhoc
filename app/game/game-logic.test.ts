import { describe, it, expect } from "vitest";
import {
    tinhTongDiem,
    tinhKetQua,
    kiemTraCuocHopLe,
    tinhSoDuMoi,
    sinhXucXacThua,
} from "./game-logic";

describe("Bộ kiểm thử TDD cho Mini-game Dự Đoán Xúc Xắc", () => {
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
    describe("2. Thuật toán phân định kết quả dự đoán", () => {
        it("Chọn Cao và ra tổng 14 (3-5-6) -> Dự đoán đúng", () => {
            const ketQua = tinhKetQua([3, 5, 6], "Cao");
            expect(ketQua).toBe("Dự đoán đúng");
        });

        it("Chọn Thấp và ra tổng 7 (1-2-4) -> Dự đoán đúng", () => {
            const ketQua = tinhKetQua([1, 2, 4], "Thấp");
            expect(ketQua).toBe("Dự đoán đúng");
        });

        it("Chọn Cao nhưng ra tổng 8 (2-3-3) -> Dự đoán sai", () => {
            const ketQua = tinhKetQua([2, 3, 3], "Cao");
            expect(ketQua).toBe("Dự đoán sai");
        });

        it("Chọn Thấp nhưng ra tổng 12 (3-4-5) -> Dự đoán sai", () => {
            const ketQua = tinhKetQua([3, 4, 5], "Thấp");
            expect(ketQua).toBe("Dự đoán sai");
        });

        it("Bộ ba đồng nhất [2, 2, 2]: dù chọn Thấp vẫn tính là Dự đoán sai", () => {
            const ketQua = tinhKetQua([2, 2, 2], "Thấp");
            expect(ketQua).toBe("Dự đoán sai");
        });

        it("Bộ ba đồng nhất [5, 5, 5]: dù chọn Cao vẫn tính là Dự đoán sai", () => {
            const ketQua = tinhKetQua([5, 5, 5], "Cao");
            expect(ketQua).toBe("Dự đoán sai");
        });

        it("Chưa chọn mức dự đoán thì trả về 'Chưa tung'", () => {
            const ketQua = tinhKetQua([1, 2, 3], "");
            expect(ketQua).toBe("Chưa tung");
        });
    });

    // ----------------------------------------------------
    describe("3. Thuật toán kiểm tra mức điểm tham gia hợp lệ", () => {
        it("Điểm tham gia hợp lệ (nhỏ hơn hoặc bằng số dư)", () => {
            const check = kiemTraCuocHopLe(100000, 20000);
            expect(check.valid).toBe(true);
        });

        it("Báo lỗi nếu mức điểm bằng 0 hoặc số âm", () => {
            const check0 = kiemTraCuocHopLe(100000, 0);
            expect(check0.valid).toBe(false);
            expect(check0.error).toBe("Số điểm tham gia phải lớn hơn 0!");

            const checkAm = kiemTraCuocHopLe(100000, -5000);
            expect(checkAm.valid).toBe(false);
        });

        it("Báo lỗi nếu mức điểm vượt quá số dư hiện có", () => {
            const check = kiemTraCuocHopLe(50000, 100000);
            expect(check.valid).toBe(false);
            expect(check.error).toBe("Số dư điểm không đủ để tham gia!");
        });
    });

    // ----------------------------------------------------
    describe("4. Thuật toán cộng / trừ điểm tích lũy", () => {
        it("Khi dự đoán đúng: cộng thêm điểm thưởng", () => {
            const soDuMoi = tinhSoDuMoi(100000, 30000, "Dự đoán đúng");
            expect(soDuMoi).toBe(130000);
        });

        it("Khi dự đoán sai: trừ điểm tương ứng", () => {
            const soDuMoi = tinhSoDuMoi(100000, 30000, "Dự đoán sai");
            expect(soDuMoi).toBe(70000);
        });
    });

    // ----------------------------------------------------
    describe("5. Thuật toán chế độ thử thách (Tạo kết quả ngược dự đoán)", () => {
        it("Người chơi chọn Cao: hàm luôn tạo ra tổng điểm thuộc nhóm Thấp (4..10)", () => {
            for (let i = 0; i < 50; i++) {
                const dice = sinhXucXacThua("Cao");
                const sum = tinhTongDiem(dice);
                expect(sum).toBeGreaterThanOrEqual(4);
                expect(sum).toBeLessThanOrEqual(10);
            }
        });

        it("Người chơi chọn Thấp: hàm luôn tạo ra tổng điểm thuộc nhóm Cao (11..17)", () => {
            for (let i = 0; i < 50; i++) {
                const dice = sinhXucXacThua("Thấp");
                const sum = tinhTongDiem(dice);
                expect(sum).toBeGreaterThanOrEqual(11);
                expect(sum).toBeLessThanOrEqual(17);
            }
        });
    });
});
