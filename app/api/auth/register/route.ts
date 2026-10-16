import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const cleanUsername = (username || "").trim();
        const cleanPassword = password || "";

        if (!cleanUsername || !cleanPassword) {
            return NextResponse.json(
                { success: false, message: "Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!" },
                { status: 400 }
            );
        }

        if (cleanPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                { status: 400 }
            );
        }

        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        let users = [];
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, "utf-8");
            users = JSON.parse(fileData || "[]");
        }

        const isDuplicate = users.some(
            (u: any) => (u.username || "").toLowerCase() === cleanUsername.toLowerCase()
        );

        if (isDuplicate) {
            return NextResponse.json(
                { success: false, message: "Tên tài khoản này đã có người sử dụng!" },
                { status: 400 }
            );
        }

        const newUser = {
            id: Date.now(),
            username: cleanUsername,
            password: cleanPassword,
            role: "user",
            balance: 100000,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

        return NextResponse.json({
            success: true,
            message: "Đăng ký tài khoản thành công!",
            user: {
                username: newUser.username,
                role: newUser.role,
                balance: newUser.balance,
            },
        });
    } catch (error) {
        console.error("Lỗi API register:", error);
        return NextResponse.json(
            { success: false, message: "Lỗi máy chủ khi đăng ký tài khoản!" },
            { status: 500 }
        );
    }
}
