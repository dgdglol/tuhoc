export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export type Choice = 'Tài' | 'Xỉu' | '';
export type Result = 'Nhà cái thắng' | 'Người chơi thắng' | 'Chưa xắc';

/**
 * 1. Hàm tính tổng điểm 3 viên xúc xắc
 */
export function tinhTongDiem(dice: DiceValue[]): number {
    return dice.reduce((acc, cur) => acc + cur, 0);
}

/**
 * 2. Phân định Thắng / Thua theo luật:
 * - 3 viên giống nhau (Bão): Nhà cái luôn thắng
 * - Tổng 11 - 17 & chọn Tài: Người chơi thắng
 * - Tổng 4 - 10 & chọn Xỉu: Người chơi thắng
 * - Còn lại: Nhà cái thắng
 */
export function tinhKetQua(dice: DiceValue[], choice: Choice): Result {
    if (!choice) return 'Chưa xắc';

    const [d1, d2, d3] = dice;
    const sum = tinhTongDiem(dice);

    // Luật 1: 3 con giống nhau (Bão)
    if (d1 === d2 && d2 === d3) {
        return 'Nhà cái thắng';
    }

    // Luật 2: Cửa Tài (11 đến 17)
    if (sum >= 11 && sum <= 17 && choice === 'Tài') {
        return 'Người chơi thắng';
    }

    // Luật 3: Cửa Xỉu (4 đến 10)
    if (sum >= 4 && sum <= 10 && choice === 'Xỉu') {
        return 'Người chơi thắng';
    }

    return 'Nhà cái thắng';
}

/**
 * 3. Kiểm tra tính hợp lệ của tiền cược
 */
export function kiemTraCuocHopLe(balance: number, betAmount: number): { valid: boolean; error?: string } {
    if (betAmount <= 0) {
        return { valid: false, error: 'Số tiền cược phải lớn hơn 0!' };
    }
    if (betAmount > balance) {
        return { valid: false, error: 'Số dư không đủ để đặt cược!' };
    }
    return { valid: true };
}

/**
 * 4. Tính toán số dư mới sau mỗi ván cược
 */
export function tinhSoDuMoi(balance: number, betAmount: number, result: Result): number {
    if (result === 'Người chơi thắng') {
        return balance + betAmount;
    }
    if (result === 'Nhà cái thắng') {
        return balance - betAmount;
    }
    return balance;
}

/**
 * 5. Thuật toán tạo xúc xắc làm người chơi THUA (Hàm Bịp)
 */
export function sinhXucXacThua(choice: Choice): DiceValue[] {
    const getRandom = (): DiceValue => (Math.floor(Math.random() * 6) + 1) as DiceValue;

    if (choice === 'Tài') {
        // Cần thua -> tổng phải từ 4 đến 10
        const losingTotal = Math.floor(Math.random() * (10 - 4 + 1)) + 4;
        let d1: DiceValue, d2: DiceValue, d3: DiceValue;
        do {
            d1 = getRandom();
            d2 = getRandom();
            d3 = getRandom();
        } while (d1 + d2 + d3 !== losingTotal);
        return [d1, d2, d3];
    } else if (choice === 'Xỉu') {
        // Cần thua -> tổng phải từ 11 đến 17
        const losingTotal = Math.floor(Math.random() * (17 - 11 + 1)) + 11;
        let d1: DiceValue, d2: DiceValue, d3: DiceValue;
        do {
            d1 = getRandom();
            d2 = getRandom();
            d3 = getRandom();
        } while (d1 + d2 + d3 !== losingTotal);
        return [d1, d2, d3];
    }

    return [getRandom(), getRandom(), getRandom()];
}
