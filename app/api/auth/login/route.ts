import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập tài khoản và mật khẩu!' },
        { status: 400 }
      );
    }

    let users = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      users = JSON.parse(fileData || '[]');
    }

    const user = users.find(
      (u: any) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Sai tài khoản hoặc mật khẩu!' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        username: user.username,
        role: user.role || 'user',
        balance: user.balance ?? 0,
      },
    });
  } catch (error) {
    console.error('Lỗi API login:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ nội bộ' },
      { status: 500 }
    );
  }
}
