"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { StatusBadge, orderStatusVariant } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useOrders } from "@/lib/hooks/use-orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { Spinner } from "@/components/shared/Spinner";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="page-container py-20 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-container py-16">
        <h1 className="text-h1 text-[#0F172A] mb-8">My Orders</h1>
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders yet. Start shopping to see your orders here."
          action={{ label: "Start Shopping", href: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-h1 text-[#0F172A] mb-8">My Orders</h1>

      {/* Desktop table */}
      <div className="hidden md:block card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {["Order ID", "Date", "Items", "Total", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-600 text-[#475569] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/orders/${order.id}`} className="text-sm font-600 text-[#7C3AED] hover:underline">
                    {order.id}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-[#475569]">{formatDate(order.createdAt)}</td>
                <td className="px-5 py-4 text-sm text-[#475569]">{order.items.length} {order.items.length === 1 ? "item" : "items"}</td>
                <td className="px-5 py-4 text-sm font-700 text-[#0F172A]">{formatPrice(order.total)}</td>
                <td className="px-5 py-4">
                  <StatusBadge variant={orderStatusVariant(order.status)} />
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-600 text-[#7C3AED] hover:text-[#6D28D9]"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="card-base p-4 block hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-700 text-[#7C3AED]">{order.id}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <StatusBadge variant={orderStatusVariant(order.status)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#64748B]">{order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
              <p className="text-base font-700 text-[#0F172A]">{formatPrice(order.total)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
