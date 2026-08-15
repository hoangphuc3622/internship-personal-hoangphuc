import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi server", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { name, color } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Tên danh mục là bắt buộc" }, { status: 400 });
    }

    // 1. KIỂM TRA XEM TÊN DANH MỤC ĐÃ TỒN TẠI CHƯA
    const existingCategory = await prisma.category.findFirst({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: `Danh mục "${name.trim()}" đã tồn tại trên hệ thống!` },
        { status: 400 }
      );
    }

    // 2. NẾU CHƯA CÓ THÌ TIẾN HÀNH TẠO MỚI
    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        color: color || "#3b82f6",
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi server khi tạo", details: error.message }, { status: 500 });
  }
}