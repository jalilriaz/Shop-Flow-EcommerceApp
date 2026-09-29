"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MapPin, CreditCard, Calendar, Truck, Printer } from "lucide-react";
import { useOrder } from "@/lib/hooks/use-orders";
import { OrderStatus } from "@/components/shared/OrderStatus";
import { StatusBadge, orderStatusVariant } from "@/components/shared/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Spinner } from "@/components/shared/Spinner";
import { OrderInvoiceModal } from "@/components/order/OrderInvoiceModal";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading, isError } = useOrder(id);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="page-container py-20 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="text-h2 text-[#0F172A] mb-2">Order Not Found</h1>
        <p className="text-[#64748B] mb-6">The order you are looking for does not exist.</p>
        <Link href="/orders" className="px-6 py-3 bg-[#7C3AED] text-white font-600 rounded-[10px]">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8 max-w-4xl">
      {/* Invoice Modal */}
      <OrderInvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-500 text-[#64748B] hover:text-[#7C3AED] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <button
          type="button"
          onClick={() => setIsInvoiceOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Receipt / Invoice
        </button>
      </div>

      {/* Header card */}
      <div className="card-base p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-h2 text-[#0F172A]">{order.id}</h1>
              <StatusBadge variant={orderStatusVariant(order.status)} />
            </div>
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-[#64748B]">Total Amount</p>
            <p className="text-2xl font-700 text-[#0F172A]">{formatPrice(order.total)}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-4 border-t border-[#E2E8F0]">
          <h2 className="text-sm font-600 text-[#0F172A] mb-6">Tracking Timeline</h2>
          <OrderStatus status={order.status} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Shipping details */}
        <div className="card-base p-5">
          <div className="flex items-center gap-2 text-sm font-600 text-[#0F172A] mb-3">
            <MapPin className="w-4 h-4 text-[#7C3AED]" />
            Shipping Address
          </div>
          <div className="text-xs text-[#475569] space-y-1">
            <p className="font-600 text-[#0F172A]">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2 text-[#64748B]">{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment info */}
        <div className="card-base p-5">
          <div className="flex items-center gap-2 text-sm font-600 text-[#0F172A] mb-3">
            <CreditCard className="w-4 h-4 text-[#7C3AED]" />
            Payment Info
          </div>
          <div className="text-xs text-[#475569] space-y-2">
            <div>
              <p className="text-[#64748B]">Method</p>
              <p className="font-500 text-[#0F172A]">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[#64748B]">Status</p>
              <StatusBadge
                variant={order.paymentStatus === "paid" ? "paid" : "pending"}
              />
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="card-base p-5">
          <div className="flex items-center gap-2 text-sm font-600 text-[#0F172A] mb-3">
            <Truck className="w-4 h-4 text-[#7C3AED]" />
            Delivery Details
          </div>
          <div className="text-xs text-[#475569] space-y-2">
            <div>
              <p className="text-[#64748B]">Carrier</p>
              <p className="font-500 text-[#0F172A]">Standard Express</p>
            </div>
            <div>
              <p className="text-[#64748B]">Tracking Number</p>
              <p className="font-500 text-[#0F172A]">{order.trackingNumber ?? "Processing"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="card-base p-6">
        <h2 className="text-base font-700 text-[#0F172A] mb-4">Order Items</h2>
        <div className="divide-y divide-[#E2E8F0]">
          {order.items.map((item) => (
            <div key={item.productId} className="py-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-[10px] bg-[#F8FAFC] overflow-hidden shrink-0 border border-[#E2E8F0]">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.productId}`}
                  className="text-sm font-600 text-[#0F172A] hover:text-[#7C3AED] transition-colors line-clamp-1"
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="text-sm font-700 text-[#0F172A] shrink-0">
                {formatPrice(item.total)}
              </p>
            </div>
          ))}
        </div>

        {/* Cost breakdown */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] space-y-2 text-sm max-w-xs ml-auto">
          <div className="flex justify-between text-[#64748B]">
            <span>Subtotal</span>
            <span className="font-500 text-[#0F172A]">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Shipping</span>
            <span className="font-500 text-[#0F172A]">
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#16A34A]">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-700 text-[#0F172A] pt-2 border-t border-[#E2E8F0]">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
