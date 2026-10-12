import { NextResponse } from "next/server";
import fs from "fs"; // Thư viện đọc/ghi file của Node.js
import path from "path";

// Đường dẫn file lưu trữ: thư mục project / data / users.json
const filePath =path.join(process.cwd(), "data", "users.json");
export async function POST(request: Request) {
    try {
        // Bước 1: Nhận username, password từ lệnh fetch của bạn
        const { username, password } = await request.json();

        // Bước 2: Tạo thư mục 'data' nếu chưa có
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Bước 3: Đọc dữ liệu cũ đang có trong file ra (nếu có)
        let users = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, "utf-8");
            users = JSON.parse(fileData || "[]");
        }

        // Bước 4: Kiểm tra xem username đã có ai đặt chưa
        if (users.some((u: any) => u.username === username)) {
            return NextResponse.json({ success: false, message: "Tài khoản đã có người dùng!" }, { status: 400 });
        }

        // Bước 5: TẠO TÀI KHOẢN MỚI
        const newUser = {
            id: Date.now(), // Mã định danh duy nhất
            username,
            password, // (Sau này học thêm thư viện 'bcrypt' để mã hóa chuỗi này)
            balance: 100000,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);

        // 👉 ĐÂY LÀ CHỖ ĐẨY DỮ LIỆU VÀO Ổ CỨNG: Ghi đè lại vào file users.json
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

        return NextResponse.json({
            success: true,
            message: "Tạo tài khoản và lưu thành công!",
            user: { username: newUser.username, balance: newUser.balance }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Lỗi lưu dữ liệu" }, { status: 500 });
    }
}