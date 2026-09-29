import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | ShopFlow",
    template: "%s | ShopFlow Admin",
  },
};

import { AdminRoute } from "@/components/auth/AdminRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#FAFAFA]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminRoute>
  );
}
