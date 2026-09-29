"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Star,
  Settings,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tag },
    ],
  },
  {
    heading: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    heading: "Engagement",
    items: [{ label: "Reviews", href: "/admin/reviews", icon: Star }],
  },
  {
    heading: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 min-h-screen bg-white border-r border-[#E2E8F0] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E2E8F0]">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#7C3AED] flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-700 text-[#0F172A] text-base leading-tight">
              Shop<span className="text-[#7C3AED]">Flow</span>
            </p>
            <p className="text-[10px] text-[#94A3B8] font-500 leading-tight">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto" aria-label="Admin navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading}>
            <p className="px-3 mb-1.5 text-[10px] font-600 text-[#94A3B8] uppercase tracking-wider">
              {section.heading}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-500 transition-all duration-150",
                        active
                          ? "bg-[#F5F3FF] text-[#7C3AED] font-600"
                          : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <item.icon className={cn("w-4 h-4", active ? "text-[#7C3AED]" : "text-[#94A3B8]")} />
                      {item.label}
                      {active && <ChevronRight className="w-3 h-3 ml-auto text-[#7C3AED]" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#E2E8F0]">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-[#64748B] hover:text-[#7C3AED] transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          View Storefront
        </Link>
      </div>
    </aside>
  );
}
