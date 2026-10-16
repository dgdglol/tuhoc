import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ success: true, users: [] });
        }
        const fileData = fs.readFileSync(filePath, "utf-8");
        const users = JSON.parse(fileData || "[]");
        return NextResponse.json({
            success: true,
            users,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Không thể đọc file data/users.json" },
            { status: 500 }
        );
    }
}
