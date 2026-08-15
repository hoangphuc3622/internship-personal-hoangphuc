import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email này đã được sử dụng" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "USER",
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json(
      { message: "Đăng ký thành công", user },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Lỗi tạo tài khoản", details: error?.message },
      { status: 500 }
    );
  }
}