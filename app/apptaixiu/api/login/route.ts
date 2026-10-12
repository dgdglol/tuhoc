import {NextResponse } from "next/server";
import fs from "fs"; // Thư viện đọc/ghi file của Node.js
import path from "path";
const filePath =path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
    try {
    const { username, password } = await request.json();

    if(!username || !password) {
        return NextResponse.json({ success: false, message: "Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!" }, 
            { status: 400 }
        );
    }

    let users = [];
    if(fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf-8");// đọc toàn bộ dữ liệu trong file users.json ra
        users = JSON.parse(fileData || "[]");
    }
    const user=users.find((u:any)=>u.username===username && u.password===password);
    if(!user) {
        return NextResponse.json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" }, 
            { status: 401 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Đăng nhập thành công!",
        user: { username: user.username, balance: user.balance }
    });
    } catch(error){
    return NextResponse.json({ success: false, message: "Lỗi lưu dữ liệu" }, 
        { status: 500 }
    );
    }
}