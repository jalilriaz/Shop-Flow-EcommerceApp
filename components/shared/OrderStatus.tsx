"use client";

import { cn } from "@/lib/utils";
import { OrderStatus as OrderStatusType } from "@/lib/types/order";
import {
  ShoppingCart,
  CheckCircle,
  Settings,
  Truck,
  Package,
  XCircle,
} from "lucide-react";

const STEPS: {
  key: OrderStatusType;
  label: string;
  Icon: React.ElementType;
}[] = [
  { key: "pending", label: "Order Placed", Icon: ShoppingCart },
  { key: "confirmed", label: "Confirmed", Icon: CheckCircle },
  { key: "processing", label: "Processing", Icon: Settings },
  { key: "shipped", label: "Shipped", Icon: Truck },
  { key: "delivered", label: "Delivered", Icon: Package },
];

const STATUS_ORDER: OrderStatusType[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

interface OrderStatusProps {
  status: OrderStatusType;
  className?: string;
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  if (status === "cancelled") {
    return (
      <div className={cn("flex items-center gap-3 p-4 rounded-[12px] bg-[#FEF2F2] border border-[#FEE2E2]", className)}>
        <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
        <div>
          <p className="text-sm font-600 text-[#B91C1C]">Order Cancelled</p>
          <p className="text-xs text-[#EF4444] mt-0.5">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E2E8F0] z-0" />

        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const future = index > currentIndex;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-2 z-10 flex-1"
            >
              {/* Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  done && "bg-[#7C3AED] border-[#7C3AED]",
                  active && "bg-white border-[#7C3AED] shadow-md shadow-brand-200",
                  future && "bg-white border-[#E2E8F0]"
                )}
              >
                <step.Icon
                  className={cn(
                    "w-4 h-4",
                    done && "text-white",
                    active && "text-[#7C3AED]",
                    future && "text-[#CBD5E1]"
                  )}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-500 text-center leading-tight",
                  done && "text-[#7C3AED]",
                  active && "text-[#0F172A] font-600",
                  future && "text-[#94A3B8]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
