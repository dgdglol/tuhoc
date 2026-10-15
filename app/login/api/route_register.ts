import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath =path.join(process.cwd(),'data', 'users.json');
export async function POST( request :Request) {
    try{
        const {username, password} = await request.json();

        let users = [];
        if(fs.existsSync(filePath)){
            const fileData = fs.readFileSync(filePath, "utf-8");
            users = JSON.parse(fileData|| "[]" )
        }

        if(users.some((u: any)=>u.username === username)){
            return NextResponse.json({
                success: false ,
                message: "Tai khoan da co ng dung",
            }
            , {
                status: 400,
            });
        }
        const newUser ={
            id: Date.now(),
            username,
            password,
            balance: 100000,
            createdAt: new Date().toISOString(),
        }
         users.push(newUser);
        
        //ĐÂY LÀ CHỖ ĐẨY DỮ LIỆU VÀO Ổ CỨNG: Ghi đè lại vào file users.json
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
        
        return NextResponse.json({
            success: true,
            message: "Tạo tài khoản và lưu thành công!",
            user: { username: newUser.username, balance: newUser.balance }
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "Da xay ra loi",
        }, { status: 500 });
    }
}