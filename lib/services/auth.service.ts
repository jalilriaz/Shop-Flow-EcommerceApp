import { User } from "@/lib/types/user";
import { ApiResponse } from "@/lib/types/api";
import { sleep } from "@/lib/utils";

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "user@shopflow.com",
    role: "customer",
    createdAt: "2024-01-01T00:00:00Z",
    password: "password",
  },
  {
    id: "user-admin",
    name: "Admin User",
    email: "admin@shopflow.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    password: "admin",
  },
];

export const authService = {
  async login(email: string, _password: string): Promise<ApiResponse<User>> {
    await sleep(200);
    const found = MOCK_USERS.find((u) => u.email === email);
    if (!found) {
      throw new Error("Invalid email or password.");
    }
    const { password: _p, ...user } = found;
    return {
      success: true,
      message: "Logged in successfully",
      data: user,
    };
  },

  async register(name: string, email: string, _password: string): Promise<ApiResponse<User>> {
    await sleep(250);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "customer",
      createdAt: new Date().toISOString(),
    };
    return {
      success: true,
      message: "Registered successfully",
      data: newUser,
    };
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await sleep(50);
    try {
      const stored = localStorage.getItem("shopflow_user");
      if (stored) {
        return {
          success: true,
          message: "Current user retrieved",
          data: JSON.parse(stored),
        };
      }
    } catch {
      /* ignore */
    }
    return {
      success: true,
      message: "No active session",
      data: null,
    };
  },
};
