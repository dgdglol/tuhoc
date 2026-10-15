import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
 
const filePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
    try{
        const { username, password } = await request.json();
        if(!username || !password) {
            return NextResponse.json({ message: "Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!" }, 
                { status: 400 }
            );
        }
        let users = [];
        if(fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            users = JSON.parse(fileData || '[]');
        }
        const user = users.find((u: any) => u.username === username && u.password === password);
        if(!user) {
            return NextResponse.json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác!" }, 
                { status: 401 }
            );
        }

        return NextResponse.json({ 
            success : true,
            message: "Đăng nhập thành công!" ,
            user: {username : user.username , password : user.password}

        });
    }catch(error){
        return NextResponse.json({ success: false, message: "Loi du lieu" }, { status: 500 });

    }
}