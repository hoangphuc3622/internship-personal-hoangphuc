# Sơ Đồ Thực Thể Mối Quan Hệ (ERD)

## 1. Các bảng cơ sở dữ liệu (Prisma Models)

### Bảng User (Người dùng)
* `id`: String (PK, CUID/UUID)
* `email`: String (Unique)
* `password`: String (Hashed)
* `name`: String (Optional)
* `createdAt`: DateTime
* `updatedAt`: DateTime

### Bảng Category (Danh mục công việc)
* `id`: String (PK)
* `name`: String
* `userId`: String (FK liên kết tới User)
* `createdAt`: DateTime

### Bảng Task (Công việc)
* `id`: String (PK)
* `title`: String
* `description`: String (Optional)
* `status`: String (Pending / Completed)
* `priority`: String (Low / Medium / High)
* `categoryId`: String (FK liên kết tới Category - cho phép Null)
* `userId`: String (FK liên kết tới User)
* `createdAt`: DateTime
* `updatedAt`: DateTime

## 2. Mối quan hệ (Relationships)
* Một `User` có thể có nhiều `Category` (1 - N).
* Một `User` có thể có nhiều `Task` (1 - N).
* Một `Category` có thể chứa nhiều `Task` (1 - N).
