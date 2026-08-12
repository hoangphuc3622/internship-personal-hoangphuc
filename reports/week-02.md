# Báo Cáo Tiến Độ Tuần 2

## 1. Cong viec da lam
* Cấu hình kết nối PostgreSQL trên Supabase.
* Xây dựng Prisma Schema cho các bảng User, Task, Category.
* Viết các API Route RESTful (`/api/tasks`, `/api/tasks/[id]`).

## 2. AI Usage Log
* **Cong cu AI su dung**: ChatGPT / Gemini.
* **Muc dich**: Tối ưu hóa truy vấn Prisma và hỗ trợ debug lỗi kết nối Supabase Pooler.

## 3. Khó khăn & Giải pháp
* Khó khăn: Lỗi kết nối Supabase do xung đột giữa Direct Port 5432 và Pooler Port 6543.
* Giải pháp: Cấu hình phân tách `DATABASE_URL` và `DIRECT_URL` trong `prisma.config.ts`.