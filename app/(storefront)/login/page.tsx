"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations/auth.schema";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "user@shopflow.com",
      password: "password",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      if (data.email.includes("admin")) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to log in");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-[#7C3AED] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[#0F172A] font-700 text-xl tracking-tight">
              Shop<span className="text-[#7C3AED]">Flow</span>
            </span>
          </Link>
          <h1 className="text-h2 text-[#0F172A]">Welcome back</h1>
          <p className="text-sm text-[#64748B] mt-1">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="card-base p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                  errors.email ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.email && <p className="text-xs text-[#EF4444] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-600 text-[#475569]">Password</label>
                <a href="#" className="text-xs text-[#7C3AED] hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                {...register("password")}
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                  errors.password ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.password && <p className="text-xs text-[#EF4444] mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-600 rounded-[10px] text-sm transition-colors flex items-center justify-center mt-2"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-xs text-[#64748B]">
            <p className="font-600 text-[#0F172A] mb-1">Demo Quick Fill:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setValue("email", "user@shopflow.com"); setValue("password", "password"); }}
                className="px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded hover:border-[#7C3AED]"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={() => { setValue("email", "admin@shopflow.com"); setValue("password", "admin"); }}
                className="px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded hover:border-[#7C3AED]"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#7C3AED] font-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
