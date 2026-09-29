"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { useOrders, useUpdateOrderStatus } from "@/lib/hooks/use-orders";
import { StatusBadge, orderStatusVariant } from "@/components/shared/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatus } from "@/lib/types/order";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/Spinner";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { data: orders = [], isLoading } = useOrders({ status: selectedStatus });
  const updateStatusMutation = useUpdateOrderStatus();

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
  );

  function handleStatusChange(id: string, status: OrderStatus) {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Order status updated to ${status}`),
        onError: (err: any) => toast.error(err.message || "Failed to update status"),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-[#0F172A]">Order Management</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Track, process, and update customer order fulfillment</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-4">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-4 py-3 text-sm font-600 border-b-2 transition-colors whitespace-nowrap ${
                selectedStatus === tab.value
                  ? "border-[#7C3AED] text-[#7C3AED]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card-base p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="search"
              placeholder="Search by Order ID, customer name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-10 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-600 text-[#475569] uppercase tracking-wide">
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm font-700 text-[#7C3AED] hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-xs text-[#94A3B8]">{order.items.length} items</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-600 text-[#0F172A]">{order.customerName}</p>
                    <p className="text-xs text-[#64748B]">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#475569]">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3.5 text-sm font-700 text-[#0F172A]">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={orderStatusVariant(order.status)} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="h-8 text-xs border border-[#CBD5E1] rounded-[6px] px-2 bg-white text-[#0F172A]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-1.5 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#F5F3FF] rounded-[6px]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
