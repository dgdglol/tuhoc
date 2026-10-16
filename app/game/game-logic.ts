export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export type Choice = 'Cao' | 'Thấp' | '';
export type Result = 'Dự đoán sai' | 'Dự đoán đúng' | 'Chưa tung';

/**
 * 1. Hàm tính tổng điểm 3 viên xúc xắc
 */
export function tinhTongDiem(dice: DiceValue[]): number {
    return dice.reduce((acc, cur) => acc + cur, 0);
}

/**
 * 2. Phân định kết quả dự đoán theo quy tắc:
 * - 3 viên giống nhau (Bộ ba đồng nhất): Tính là Dự đoán sai
 * - Tổng 11 - 17 & chọn Cao: Dự đoán đúng
 * - Tổng 4 - 10 & chọn Thấp: Dự đoán đúng
 * - Còn lại: Dự đoán sai
 */
export function tinhKetQua(dice: DiceValue[], choice: Choice): Result {
    if (!choice) return 'Chưa tung';

    const [d1, d2, d3] = dice;
    const sum = tinhTongDiem(dice);

    // Quy tắc 1: 3 viên giống nhau (Bộ ba đồng nhất)
    if (d1 === d2 && d2 === d3) {
        return 'Dự đoán sai';
    }

    // Quy tắc 2: Nhóm điểm Cao (11 đến 17)
    if (sum >= 11 && sum <= 17 && choice === 'Cao') {
        return 'Dự đoán đúng';
    }

    // Quy tắc 3: Nhóm điểm Thấp (4 đến 10)
    if (sum >= 4 && sum <= 10 && choice === 'Thấp') {
        return 'Dự đoán đúng';
    }

    return 'Dự đoán sai';
}

/**
 * 3. Kiểm tra tính hợp lệ của mức điểm tham gia
 */
export function kiemTraCuocHopLe(balance: number, betAmount: number): { valid: boolean; error?: string } {
    if (betAmount <= 0) {
        return { valid: false, error: 'Số điểm tham gia phải lớn hơn 0!' };
    }
    if (betAmount > balance) {
        return { valid: false, error: 'Số dư điểm không đủ để tham gia!' };
    }
    return { valid: true };
}

/**
 * 4. Tính toán số dư điểm mới sau mỗi lượt chơi
 */
export function tinhSoDuMoi(balance: number, betAmount: number, result: Result): number {
    if (result === 'Dự đoán đúng') {
        return balance + betAmount;
    }
    if (result === 'Dự đoán sai') {
        return balance - betAmount;
    }
    return balance;
}

/**
 * 5. Thuật toán tạo bộ xúc xắc ngược dự đoán (Chế độ thử thách)
 */
export function sinhXucXacThua(choice: Choice): DiceValue[] {
    const getRandom = (): DiceValue => (Math.floor(Math.random() * 6) + 1) as DiceValue;

    if (choice === 'Cao') {
        // Tạo tổng điểm nằm trong khoảng 4 đến 10
        const targetTotal = Math.floor(Math.random() * (10 - 4 + 1)) + 4;
        let d1: DiceValue, d2: DiceValue, d3: DiceValue;
        do {
            d1 = getRandom();
            d2 = getRandom();
            d3 = getRandom();
        } while (d1 + d2 + d3 !== targetTotal);
        return [d1, d2, d3];
    } else if (choice === 'Thấp') {
        // Tạo tổng điểm nằm trong khoảng 11 đến 17
        const targetTotal = Math.floor(Math.random() * (17 - 11 + 1)) + 11;
        let d1: DiceValue, d2: DiceValue, d3: DiceValue;
        do {
            d1 = getRandom();
            d2 = getRandom();
            d3 = getRandom();
        } while (d1 + d2 + d3 !== targetTotal);
        return [d1, d2, d3];
    }

    return [getRandom(), getRandom(), getRandom()];
}
