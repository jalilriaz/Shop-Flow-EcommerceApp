"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.johnson@email.com",
    phone: "+1 (555) 234-5678",
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Profile updated successfully");
  }

  const SIDEBAR_ITEMS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package, href: "/orders" },
    { id: "wishlist", label: "Wishlist", icon: Heart, href: "/wishlist" },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="page-container py-8">
      <h1 className="text-h1 text-[#0F172A] mb-8">My Account</h1>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <div className="card-base p-3 space-y-1 h-fit">
          <div className="px-3 py-3 mb-2 border-b border-[#E2E8F0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-700">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-600 text-[#0F172A] truncate">{user?.name || "Alex Johnson"}</p>
              <p className="text-xs text-[#64748B] truncate">{user?.email || "alex.johnson@email.com"}</p>
            </div>
          </div>

          {SIDEBAR_ITEMS.map((item) => (
            item.href ? (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-500 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
              >
                <item.icon className="w-4 h-4 text-[#94A3B8]" />
                {item.label}
              </a>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-500 transition-colors text-left",
                  activeTab === item.id
                    ? "bg-[#F5F3FF] text-[#7C3AED] font-600"
                    : "text-[#475569] hover:bg-[#F8FAFC]"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-[#7C3AED]" : "text-[#94A3B8]")} />
                {item.label}
              </button>
            )
          ))}

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-500 text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-left mt-4"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

        {/* Content */}
        <div className="card-base p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-base font-700 text-[#0F172A] mb-6">Personal Information</h2>
              <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-600 text-sm rounded-[10px] transition-colors"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="text-base font-700 text-[#0F172A] mb-4">Saved Addresses</h2>
              <div className="p-4 border border-[#E2E8F0] rounded-[12px] bg-[#F8FAFC] max-w-md">
                <p className="font-600 text-sm text-[#0F172A]">Default Shipping Address</p>
                <p className="text-xs text-[#64748B] mt-1">742 Evergreen Terrace, Springfield, IL 62701, United States</p>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h2 className="text-base font-700 text-[#0F172A] mb-4">Payment Methods</h2>
              <p className="text-sm text-[#64748B]">Cash on Delivery is currently active for all your orders.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-base font-700 text-[#0F172A] mb-4">Account Settings</h2>
              <p className="text-sm text-[#64748B]">Manage security preferences and email notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
