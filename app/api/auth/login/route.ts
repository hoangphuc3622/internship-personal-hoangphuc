import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ email và mật khẩu" },
        { status: 400 }
      );
    }

    // Ép kiểu 'as any' để bypass cache type cũ của TypeScript
    const user = (await prisma.user.findUnique({
      where: { email },
    })) as any;

    if (!user) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 400 }
      );
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name ?? undefined,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Đăng nhập thành công",
      user: tokenPayload,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Auth Login Error:", error);
    return NextResponse.json(
      { error: "Lỗi đăng nhập", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}