# Test Cases - Personal Task Management System

| ID | Chức năng | Các bước thực hiện | Kết quả mong đợi | Trang thái |
|---|---|---|---|---|
| TC01 | Thêm task hợp lệ | Nhập tiêu đề "Học Next.js", bấm Thêm | Task xuất hiện trong danh sách và lưu vào DB | Pass |
| TC02 | Thêm task trống | Để trống tiêu đề, bấm Thêm | Hiển thị lỗi/HTML validation yêu cầu nhập tiêu đề | Pass |
| TC03 | Đổi trạng thái | Click vào checkbox của task | Trạng thái đổi từ PENDING <-> COMPLETED, tiêu đề gạch ngang | Pass |
| TC04 | Xóa task | Bấm nút Xóa ở 1 task | Task biến mất khỏi giao diện và xóa khỏi DB | Pass |
| TC05 | Tìm kiếm theo tiêu đề | Nhập từ khóa "Next" vào ô tìm kiếm | Chỉ hiển thị các task có chứa chữ "Next" | Pass |
| TC06 | Tìm kiếm không match | Nhập từ khóa "xyz123" | Hiển thị thông báo "Không tìm thấy công việc nào." | Pass |
| TC07 | Lọc task Chưa hoàn thành | Chọn filter "Chưa hoàn thành" | Chỉ hiển thị các task ở trạng thái PENDING | Pass |
| TC08 | Lọc task Đã hoàn thành | Chọn filter "Đã hoàn thành" | Chỉ hiển thị các task ở trạng thái COMPLETED | Pass |
| TC09 | Lọc Tất cả | Chọn filter "Tất cả trạng thái" | Hiển thị toàn bộ danh sách task | Pass |
| TC10 | Render giao diện ban đầu | Truy cập trang chủ | Tải danh sách task mới nhất từ API `/api/tasks` | Pass |