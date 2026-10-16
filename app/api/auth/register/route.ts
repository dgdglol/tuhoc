import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        let users = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, "utf-8");
            users = JSON.parse(fileData || "[]");
        }

        if (users.some((u: any) => u.username.toLowerCase() === username.trim().toLowerCase())) {
            return NextResponse.json(
                { success: false, message: "Tài khoản đã có người dùng!" },
                { status: 400 }
            );
        }

        const newUser = {
            id: Date.now(),
            username: username.trim(),
            password,
            role: "user",
            balance: 100000,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

        return NextResponse.json({
            success: true,
            message: "Tạo tài khoản và lưu thành công!",
            user: {
                username: newUser.username,
                role: newUser.role,
                balance: newUser.balance,
            },
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Lỗi lưu dữ liệu" },
            { status: 500 }
        );
    }
}
