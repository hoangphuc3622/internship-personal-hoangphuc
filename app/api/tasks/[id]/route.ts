import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH: Cập nhật công việc theo ID (Sửa tiêu đề, trạng thái, mức độ ưu tiên...)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Kiểm tra task có tồn tại không
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Không tìm thấy công việc" },
        { status: 404 }
      );
    }

    // Cập nhật các trường dữ liệu được gửi lên
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.dueDate !== undefined && {
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        }),
      },
      include: { user: true },
    });

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error("Prisma PATCH Error:", error);
    return NextResponse.json(
      { error: "Lỗi cập nhật công việc", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Xóa công việc theo ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Kiểm tra task có tồn tại không
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Không tìm thấy công việc để xóa" },
        { status: 404 }
      );
    }

    // Thực hiện xóa task
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa công việc thành công", id });
  } catch (error: any) {
    console.error("Prisma DELETE Error:", error);
    return NextResponse.json(
      { error: "Lỗi xóa công việc", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}