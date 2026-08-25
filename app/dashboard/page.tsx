"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  categoryId?: string;
  category?: Category;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE TẠO DANH MỤC MỚI ---
  const [newCategoryName, setNewCategoryName] = useState("");

  // --- STATE TÌM KIẾM & LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  // --- STATE FORM THÊM TASK ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // --- STATE FORM SỬA TASK ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("PENDING");
  const [editPriority, setEditPriority] = useState("MEDIUM");
  const [editDueDate, setEditDueDate] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  // --- STATE POPUP XÁC NHẬN XÓA ---
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // 1. CẬP NHẬT HÀM FETCH DATA AN TOÀN
  const fetchData = async () => {
    try {
      // Fetch User Me
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/auth/login"); // ĐÃ SỬA Ở ĐÂY
        return;
      }
      const meText = await meRes.text();
      const meData = meText ? JSON.parse(meText) : null;
      if (meData) setUser(meData.user || meData);

      // Fetch Tasks
      const tasksRes = await fetch("/api/tasks");
      if (tasksRes.ok) {
        const tasksText = await tasksRes.text();
        const tasksData = tasksText ? JSON.parse(tasksText) : [];
        setTasks(tasksData);
      }

      // Fetch Categories
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const catText = await catRes.text();
        const catData = catText ? JSON.parse(catText) : [];
        setCategories(catData);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. CẬP NHẬT HÀM THÊM DANH MỤC (ĐÃ FIX ĐỂ HIỂN THỊ CHI TIẾT LỖI TỪ BACKEND)
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const resText = await res.text();
      let resJson;
      try {
        resJson = resText ? JSON.parse(resText) : {};
      } catch {
        resJson = { error: resText };
      }

      if (res.ok) {
        setNewCategoryName("");
        fetchData();
      } else {
        alert(resJson.error || resJson.details || "Lỗi khi tạo danh mục");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến máy chủ");
    }
  };

  // --- HÀM XÓA DANH MỤC (ĐÃ FIX LỖI PARSE JSON) ---
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này? Các công việc thuộc danh mục này có thể bị mất liên kết.")) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const errText = await res.text();

      if (res.ok) {
        fetchData();
      } else {
        let errorMessage = "Không thể xóa danh mục";
        try {
          const errJson = errText ? JSON.parse(errText) : {};
          errorMessage = errJson.error || errorMessage;
        } catch {
          errorMessage = errText || errorMessage;
        }
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Lỗi khi xóa danh mục:", err);
      alert("Đã xảy ra lỗi kết nối đến máy chủ.");
    }
  };

  // --- HÀM THÊM TASK ---
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          categoryId: categoryId || null,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setStatus("PENDING");
        setPriority("MEDIUM");
        setDueDate("");
        setCategoryId("");
        fetchData();
      }
    } catch (err) {
      console.error("Lỗi khi thêm task:", err);
    }
  };

  // --- HÀM MỞ MẪU SỬA TASK ---
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status || "PENDING");
    setEditPriority(task.priority || "MEDIUM");
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    setEditCategoryId(task.categoryId || "");
  };

  // 3. CẬP NHẬT HÀM LƯU TASK SỬA
  const handleUpdateTask = async (id: string) => {
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
          priority: editPriority,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
          categoryId: editCategoryId || null,
        }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchData();
      } else {
        const errText = await res.text();
        let errorMessage = "Không thể cập nhật task";
        try {
          const err = errText ? JSON.parse(errText) : {};
          errorMessage = err.error || errorMessage;
        } catch {
          errorMessage = errText || errorMessage;
        }
        alert(errorMessage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- HÀM ĐỔI TRẠNG THÁI NHANH ---
  const handleQuickStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Lỗi đổi trạng thái:", err);
    }
  };

  // 4. CẬP NHẬT HÀM XÓA TASK
  const confirmDeleteTask = async () => {
    if (!deletingTask) return;

    try {
      const res = await fetch(`/api/tasks/${deletingTask.id}`, { method: "DELETE" });
      const errText = await res.text();
      if (res.ok) {
        setDeletingTask(null);
        fetchData();
      } else {
        let errorMessage = "Lỗi xóa công việc";
        try {
          const err = errText ? JSON.parse(errText) : {};
          errorMessage = err.error || errorMessage;
        } catch {
          errorMessage = errText || errorMessage;
        }
        alert(errorMessage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- LOGIC LỌC VÀ TÌM KIẾM ---
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "ALL" || task.status === filterStatus;
      const matchesCategory = filterCategory === "ALL" || task.categoryId === filterCategory;
      const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterCategory, filterPriority]);

  const renderStatusBadge = (task: Task) => {
    const config: Record<string, { label: string; color: string }> = {
      PENDING: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-800 border-amber-300" },
      IN_PROGRESS: { label: "Đang làm", color: "bg-blue-100 text-blue-800 border-blue-300" },
      COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-800 border-green-300" },
    };
    const current = config[task.status] || config["PENDING"];

    return (
      <select
        value={task.status || "PENDING"}
        onChange={(e) => handleQuickStatusChange(task.id, e.target.value)}
        className={`text-xs px-2 py-1 rounded-md border font-medium cursor-pointer outline-none transition ${current.color}`}
      >
        <option value="PENDING" className="bg-white text-black">Chờ xử lý</option>
        <option value="IN_PROGRESS" className="bg-white text-black">Đang làm</option>
        <option value="COMPLETED" className="bg-white text-black">Hoàn thành</option>
      </select>
    );
  };

  const renderPriorityBadge = (p: string) => {
    const config: Record<string, { label: string; color: string }> = {
      LOW: { label: "Ưu tiên thấp", color: "bg-gray-100 text-gray-700" },
      MEDIUM: { label: "Ưu tiên Vừa", color: "bg-yellow-100 text-yellow-800" },
      HIGH: { label: "Ưu tiên Cao", color: "bg-red-100 text-red-800 font-semibold" },
    };
    const current = config[p] || config["MEDIUM"];
    return <span className={`text-xs px-2 py-0.5 rounded ${current.color}`}>{current.label}</span>;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Công việc</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              Xin chào, <span className="font-semibold text-blue-600">{user?.name || user?.email}</span>
              {user?.role && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded uppercase">
                  {user.role}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/auth/login"); // ĐÃ SỬA Ở ĐÂY
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
          >
            Đăng xuất
          </button>
        </div>

        {/* KHU VỰC TẠO TÀI NGUYÊN (TASK + DANH MỤC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. FORM THÊM DANH MỤC MỚI & DANH SÁCH DANH MỤC */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Tạo Danh Mục Mới</h2>
              <form onSubmit={handleCreateCategory} className="space-y-3">
                <input
                  type="text"
                  placeholder="Tên danh mục (ví dụ: Học tập, Gym...)"
                  required
                  className="w-full p-2 border rounded-md text-sm text-black outline-none focus:ring-2 focus:ring-purple-500"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm font-medium transition"
                >
                  + Thêm Danh Mục
                </button>
              </form>
            </div>

            {/* HIỂN THỊ DANH SÁCH DANH MỤC KÈM NÚT XÓA */}
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Danh sách danh mục ({categories.length})</h2>
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có danh mục nào được tạo.</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <li key={cat.id} className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition"
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 2. FORM THÊM CÔNG VIỆC MỚI */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Thêm công việc mới</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tên công việc (*)..."
                  required
                  className="w-full p-2 border rounded-md text-black text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Mô tả chi tiết..."
                  className="w-full p-2 border rounded-md text-black text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Trạng thái:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm text-black"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="IN_PROGRESS">Đang làm</option>
                    <option value="COMPLETED">Hoàn thành</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">Mức ưu tiên:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm text-black"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">Hạn hoàn thành:</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm text-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">Danh mục:</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm text-black"
                  >
                    <option value="">-- Chọn Danh Mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
              >
                + Thêm Task
              </button>
            </form>
          </div>
        </div>

        {/* TÌM KIẾM & BỘ LỌC */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-md text-sm text-black"
            >
              <option value="ALL">Tất cả Trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="IN_PROGRESS">Đang làm</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-2 border rounded-md text-sm text-black"
            >
              <option value="ALL">Tất cả Độ ưu tiên</option>
              <option value="LOW">Thấp</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="HIGH">Cao</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded-md text-sm text-black"
            >
              <option value="ALL">Tất cả Danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DANH SÁCH CÔNG VIỆC */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Danh sách công việc ({filteredTasks.length})
          </h2>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Không tìm thấy công việc phù hợp.</p>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-md hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  {editingId === task.id ? (
                    <div className="w-full space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          className="p-2 border rounded text-black font-medium"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <input
                          type="text"
                          className="p-2 border rounded text-black text-sm"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="p-1 border rounded text-xs text-black"
                        >
                          <option value="PENDING">Chờ xử lý</option>
                          <option value="IN_PROGRESS">Đang làm</option>
                          <option value="COMPLETED">Hoàn thành</option>
                        </select>
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                          className="p-1 border rounded text-xs text-black"
                        >
                          <option value="LOW">Ưu tiên Thấp</option>
                          <option value="MEDIUM">Ưu tiên Vừa</option>
                          <option value="HIGH">Ưu tiên Cao</option>
                        </select>
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="p-1 border rounded text-xs text-black"
                        />
                        <select
                          value={editCategoryId}
                          onChange={(e) => setEditCategoryId(e.target.value)}
                          className="p-1 border rounded text-xs text-black"
                        >
                          <option value="">-- Danh mục --</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateTask(task.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-xs hover:bg-gray-500"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-semibold ${
                              task.status === "COMPLETED"
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </p>
                          {renderPriorityBadge(task.priority)}
                          {task.category && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-medium">
                              {task.category.name}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-500">{task.description}</p>
                        )}

                        {task.dueDate && (
                          <p className="text-xs text-gray-400">
                            📅 Hạn: {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {renderStatusBadge(task)}

                        <button
                          onClick={() => startEditing(task)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => setDeletingTask(task)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL XÁC NHẬN XÓA */}
        {deletingTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800">Xác nhận xóa công việc</h3>
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa công việc:{" "}
                <span className="font-semibold text-red-600">"{deletingTask.title}"</span>?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeletingTask(null)}
                  className="px-4 py-2 border rounded-md text-gray-600 text-sm hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteTask}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}