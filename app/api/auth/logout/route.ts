import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  // Xóa cookie token tùy theo tên cookie bạn đang dùng (ví dụ: "token" hoặc "session")
  cookieStore.delete("token"); 

  return NextResponse.json({ message: "Đăng xuất thành công" });
}