import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    // Xác thực JWT token từ cookie
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as AuthUser;

    return decoded;
  } catch (error) {
    // Nếu token hết hạn hoặc không hợp lệ
    return null;
  }
}