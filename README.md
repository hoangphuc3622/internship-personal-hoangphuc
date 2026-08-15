# Ứng Dụng Quản Lý Công Việc Cá Nhân (Personal Task Management)

Ứng dụng web được xây dựng nhằm hỗ trợ người dùng quản lý công việc cá nhân hiệu quả, hỗ trợ các tính năng CRUD công việc, tìm kiếm, lọc theo trạng thái/độ ưu tiên/danh mục, đăng ký, đăng nhập và phân quyền người dùng.

## 🚀 Công nghệ sử dụng
* **Framework:** Next.js (App Router)
* **Ngôn ngữ:** TypeScript
* **Styling:** Tailwind CSS
* **ORM:** Prisma
* **Database:** PostgreSQL

## ✨ Các tính năng chính
* **Xác thực & Phân quyền:** Đăng ký tài khoản, đăng nhập an toàn và phân quyền người dùng.
* **Quản lý công việc (Task CRUD):** Thêm mới, chỉnh sửa, thay đổi trạng thái nhanh chóng và xóa công việc.
* **Quản lý danh mục (Categories):** Phân loại công việc theo danh mục tùy chỉnh, có kiểm tra trùng lặp danh mục.
* **Tìm kiếm & Bộ lọc:** Tìm kiếm công việc theo tiêu đề, lọc theo trạng thái (Chờ xử lý, Đang làm, Hoàn thành), mức độ ưu tiên và danh mục.

## 🛠️ Hướng dẫn cài đặt và chạy dự án

1. Clone repository về máy:
   ```bash
   git clone [https://github.com/hoangphuc3622/internship-personal-hoangphuc.git](https://github.com/hoangphuc3622/internship-personal-hoangphuc.git)
   cd internship-personal-hoangphuc

    Cài đặt các gói phụ thuộc:
    Bash

    npm install
    # hoặc yarn install / pnpm install

    Cấu hình biến môi trường (.env) kết nối cơ sở dữ liệu PostgreSQL.

    Chạy lệnh migrate cơ sở dữ liệu với Prisma:
    Bash

    npx prisma db push

    Khởi động môi trường phát triển:
    Bash

    npm run dev

    Mở trình duyệt và truy cập vào http://localhost:3000/login để xem kết quả.


---

### Sau khi cập nhật, bạn chạy các lệnh sau trong Terminal để đẩy lên GitHub:

```bash
git add README.md
git commit -m "Update README.md with project documentation and details"
git push origin main
