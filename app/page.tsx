"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: string;
  category?: Category;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // State cho Tìm kiếm và Lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | PENDING | COMPLETED

  // Lấy danh sách tasks từ API
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Thêm Task mới
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        fetchTasks();
      }
    } catch (error) {
      console.error("Lỗi thêm task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái Task (PENDING <-> COMPLETED)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Lỗi cập nhật task:", error);
    }
  };

  // Xóa Task
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Lỗi xóa task:", error);
    }
  };

  // Logic lọc và tìm kiếm danh sách task
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="max-w-2xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Quản lý Công việc
      </h1>

      {/* Form thêm task mới */}
      <form onSubmit={handleAddTask} className="mb-6 p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-900 space-y-3">
        <input
          type="text"
          placeholder="Nhập tiêu đề công việc..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-zinc-800"
          required
        />
        <input
          type="text"
          placeholder="Mô tả chi tiết (không bắt buộc)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-zinc-800"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 font-medium"
        >
          {loading ? "Đang tạo..." : "Thêm công việc"}
        </button>
      </form>

      {/* Thanh Tìm kiếm và Bộ lọc */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm công việc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded text-black dark:text-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded text-black dark:text-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Chưa hoàn thành</option>
          <option value="COMPLETED">Đã hoàn thành</option>
        </select>
      </div>

      {/* Danh sách task */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Không tìm thấy công việc nào.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === "COMPLETED"}
                  onChange={() => handleToggleStatus(task.id, task.status)}
                  className="w-5 h-5 cursor-pointer"
                />
                <div>
                  <h3
                    className={`font-semibold text-gray-800 dark:text-white ${
                      task.status === "COMPLETED" ? "line-through text-gray-400 dark:text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition"
              >
                Xóa
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}