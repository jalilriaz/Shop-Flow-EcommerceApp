"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

function buildBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    crumbs.push({ label, href: current });
  }
  return crumbs;
}

export function AdminTopbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);

  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-6 gap-4">
      {/* Breadcrumb */}
      <nav className="flex-1 flex items-center gap-1.5 overflow-hidden" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />}
            {index < breadcrumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className="text-sm text-[#64748B] hover:text-[#0F172A] truncate transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-sm font-600 text-[#0F172A] truncate">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#7C3AED] rounded-full" />
        </button>

        {/* Account */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAccountOpen(!accountOpen)}
            className="flex items-center gap-2 pl-1 pr-2 h-9 min-h-[44px] rounded-[10px] hover:bg-[#F1F5F9] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-700">
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <span className="text-sm font-500 text-[#0F172A] hidden sm:block">
              {user?.name?.split(" ")[0] ?? "Admin"}
            </span>
          </button>

          {accountOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 card-base shadow-md z-20 py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-[#E2E8F0]">
                  <p className="text-sm font-600 text-[#0F172A]">{user?.name}</p>
                  <p className="text-xs text-[#64748B]">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { logout(); setAccountOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
