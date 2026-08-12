import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lấy danh sách tasks (Sắp xếp mới nhất lên đầu, kèm thông tin user và category)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: { 
        user: true,
        category: true 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error("Prisma GET Error:", error);
    return NextResponse.json(
      { error: "Lỗi lấy dữ liệu", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// POST: Tạo task mới
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate title bắt buộc
    if (!body?.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Tiêu đề (title) là bắt buộc" },
        { status: 400 }
      );
    }

    // Tự động tìm hoặc tạo user mẫu nếu chưa có
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@example.com",
          name: "User Demo",
        },
      });
    }

    // Tạo Task mới kèm categoryId (nếu truyền lên)
    const newTask = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        status: body.status || "PENDING",
        priority: body.priority || "MEDIUM",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        userId: user.id,
        categoryId: body.categoryId || null,
      },
      include: { 
        user: true,
        category: true 
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error("Prisma POST Error:", error);
    return NextResponse.json(
      { error: "Lỗi tạo task", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}