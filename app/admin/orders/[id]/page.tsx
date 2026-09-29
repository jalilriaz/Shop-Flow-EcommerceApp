"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, CreditCard, Calendar, Truck, User } from "lucide-react";
import { useOrder, useUpdateOrderStatus } from "@/lib/hooks/use-orders";
import { OrderStatus } from "@/components/shared/OrderStatus";
import { StatusBadge, orderStatusVariant } from "@/components/shared/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatus as OrderStatusType } from "@/lib/types/order";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/Spinner";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);
  const updateStatusMutation = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-h2 text-[#0F172A] mb-2">Order Not Found</h1>
        <Link href="/admin/orders" className="px-6 py-3 bg-[#7C3AED] text-white font-600 rounded-[10px]">
          Back to Orders
        </Link>
      </div>
    );
  }

  function handleStatusChange(newStatus: OrderStatusType) {
    updateStatusMutation.mutate(
      { id: order!.id, status: newStatus },
      {
        onSuccess: () => toast.success(`Order status updated to ${newStatus}`),
        onError: (err: any) => toast.error(err.message || "Failed to update status"),
      }
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-[8px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-h2 text-[#0F172A]">{order.id}</h1>
            <p className="text-xs text-[#64748B]">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-600 text-[#475569]">Fulfillment Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatusType)}
            className="h-10 px-3 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] font-600 bg-white"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="card-base p-6">
        <h2 className="text-sm font-700 text-[#0F172A] mb-6">Order Lifecycle Status</h2>
        <OrderStatus status={order.status} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="card-base p-5">
          <div className="flex items-center gap-2 text-sm font-600 text-[#0F172A] mb-3">
            <User className="w-4 h-4 text-[#7C3AED]" />
            Customer Details
          </div>
          <div className="text-xs text-[#475569] space-y-1">
            <p className="font-600 text-[#0F172A]">{order.customerName}</p>
            <p>{order.customerEmail}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="card-base p-5">
          <div className="flex items-center gap-2 text-sm font-600 text-[#0F172A] mb-3">
            <MapPin className="w-4 h-4 text-[#7C3AED]" />
            Delivery Destination
          </div>
          <div className="text-xs text-[#475569] space-y-1">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="card-base p-5">
          <div className="flex items-center gap-2 text-sm font-600 text-[#0F172A] mb-3">
            <CreditCard className="w-4 h-4 text-[#7C3AED]" />
            Payment Status
          </div>
          <div className="text-xs text-[#475569] space-y-2">
            <div>
              <p className="text-[#64748B]">Method</p>
              <p className="font-600 text-[#0F172A]">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[#64748B]">Status</p>
              <StatusBadge variant={order.paymentStatus === "paid" ? "paid" : "pending"} />
            </div>
          </div>
        </div>
      </div>

      {/* Order Line Items */}
      <div className="card-base p-6">
        <h2 className="text-base font-700 text-[#0F172A] mb-4">Purchased Items</h2>
        <div className="divide-y divide-[#E2E8F0]">
          {order.items.map((item) => (
            <div key={item.productId} className="py-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-[8px] bg-[#F8FAFC] overflow-hidden shrink-0 border border-[#E2E8F0]">
                <Image src={item.productImage} alt={item.productName} width={56} height={56} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 text-[#0F172A] line-clamp-1">{item.productName}</p>
                <p className="text-xs text-[#64748B]">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <p className="text-sm font-700 text-[#0F172A]">{formatPrice(item.total)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#E2E8F0] space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-[#64748B]">
            <span>Subtotal</span>
            <span className="font-500 text-[#0F172A]">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Shipping</span>
            <span className="font-500 text-[#0F172A]">{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-700 text-[#0F172A] pt-2 border-t border-[#E2E8F0]">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
