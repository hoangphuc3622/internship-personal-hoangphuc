 "use client";


import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";


export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {

      const res = await fetch("/api/auth/login", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(formData),

      });


      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");


      router.push("/dashboard");

      router.refresh();

    } catch (err: any) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng nhập</h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>

            <label className="block text-sm font-medium text-gray-700">Email</label>

            <input

              type="email"

              required

              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"

              value={formData.email}

              onChange={(e) => setFormData({ ...formData, email: e.target.value })}

            />

          </div>

          <div>

            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>

            <input

              type="password"

              required

              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"

              value={formData.password}

              onChange={(e) => setFormData({ ...formData, password: e.target.value })}

            />

          </div>

          <button

            type="submit"

            disabled={loading}

            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"

          >

            {loading ? "Đang xử lý..." : "Đăng nhập"}

          </button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-600">

          Chưa có tài khoản?{" "}

          <Link href="/auth/register" className="text-blue-600 hover:underline">

            Tạo tài khoản

          </Link>

        </p>

      </div>

    </div>

  );

} 