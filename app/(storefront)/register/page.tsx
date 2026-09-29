"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth.schema";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerAuth(data.name, data.email, data.password);
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to register");
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
          <h1 className="text-h2 text-[#0F172A]">Create an account</h1>
          <p className="text-sm text-[#64748B] mt-1">Join ShopFlow for a premium shopping experience</p>
        </div>

        {/* Card */}
        <div className="card-base p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Full Name</label>
              <input
                type="text"
                {...register("name")}
                placeholder="Alex Johnson"
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                  errors.name ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.name && <p className="text-xs text-[#EF4444] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Email Address</label>
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
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="At least 6 characters"
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
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#64748B]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#7C3AED] font-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
