import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET: Lấy danh sách tasks (Chỉ lấy task của user đang đăng nhập, nếu là ADMIN sẽ lấy tất cả)
export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json(
      { error: "Chưa đăng nhập hoặc phiên làm việc đã hết hạn" },
      { status: 401 }
    );
  }

  try {
    // ADMIN xem tất cả tasks, USER chỉ xem tasks của chính mình
    const whereClause = authUser.role === "ADMIN" ? {} : { userId: authUser.id };

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: true,
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
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json(
      { error: "Chưa đăng nhập hoặc phiên làm việc đã hết hạn" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate title bắt buộc
    if (!body?.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Tiêu đề (title) là bắt buộc" },
        { status: 400 }
      );
    }

    // Tạo Task mới gắn với người dùng đang đăng nhập
    const newTask = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        status: body.status || "PENDING",
        priority: body.priority || "MEDIUM",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        userId: authUser.id,
        categoryId: body.categoryId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: true,
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