import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    // Await params theo chuẩn Next.js mới
    const resolvedParams = await params;
    const categoryId = resolvedParams.id;

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Không tìm thấy danh mục" }, { status: 404 });
    }

    // 1. Gỡ liên kết hoặc xóa các task thuộc danh mục này trước để tránh lỗi ràng buộc khóa ngoại
    await prisma.task.updateMany({
      where: { categoryId: categoryId },
      data: { categoryId: null }, // Hoặc bạn có thể dùng deleteMany nếu muốn xóa luôn cả task
    });

    // 2. Tiến hành xóa danh mục
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Xóa danh mục thành công" }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi chi tiết khi xóa danh mục:", error);
    return NextResponse.json(
      { error: "Lỗi server khi xóa", details: error.message },
      { status: 500 }
    );
  }
}