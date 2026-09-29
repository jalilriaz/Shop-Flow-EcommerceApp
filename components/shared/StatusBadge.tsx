import { cn } from "@/lib/utils";
import { OrderStatus as OrderStatusType } from "@/lib/types/order";

type BadgeVariant =
  | "delivered"
  | "processing"
  | "pending"
  | "cancelled"
  | "confirmed"
  | "shipped"
  | "active"
  | "inactive"
  | "low-stock"
  | "out-of-stock"
  | "in-stock"
  | "draft"
  | "approved"
  | "rejected"
  | "paid"
  | "failed";

const variantStyles: Record<BadgeVariant, string> = {
  delivered:    "bg-[#DCFCE7] text-[#15803D]",
  active:       "bg-[#DCFCE7] text-[#15803D]",
  "in-stock":   "bg-[#DCFCE7] text-[#15803D]",
  approved:     "bg-[#DCFCE7] text-[#15803D]",
  paid:         "bg-[#DCFCE7] text-[#15803D]",
  processing:   "bg-[#DBEAFE] text-[#1D4ED8]",
  confirmed:    "bg-[#DBEAFE] text-[#1D4ED8]",
  shipped:      "bg-[#DBEAFE] text-[#1D4ED8]",
  pending:      "bg-[#FEF3C7] text-[#B45309]",
  "low-stock":  "bg-[#FEF3C7] text-[#B45309]",
  draft:        "bg-[#FEF3C7] text-[#B45309]",
  cancelled:    "bg-[#FEE2E2] text-[#B91C1C]",
  "out-of-stock": "bg-[#FEE2E2] text-[#B91C1C]",
  inactive:     "bg-[#F1F5F9] text-[#475569]",
  rejected:     "bg-[#FEE2E2] text-[#B91C1C]",
  failed:       "bg-[#FEE2E2] text-[#B91C1C]",
};

const variantLabels: Partial<Record<BadgeVariant, string>> = {
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
  "in-stock": "In Stock",
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const displayLabel =
    label ?? variantLabels[variant] ?? (variant.charAt(0).toUpperCase() + variant.slice(1));

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 leading-5 whitespace-nowrap",
        variantStyles[variant] ?? "bg-[#F1F5F9] text-[#475569]",
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

/** Helper: map OrderStatus to badge variant */
export function orderStatusVariant(status: OrderStatusType): BadgeVariant {
  return status as BadgeVariant;
}
