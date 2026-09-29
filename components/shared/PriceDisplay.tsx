"use client";

import { cn, formatPrice, discountPercent } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  discountPrice?: number;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
}

const priceSizeMap = {
  sm: "text-base font-bold",
  md: "text-lg font-bold",
  lg: "text-2xl font-bold",
};

const originalSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function PriceDisplay({
  price,
  discountPrice,
  size = "md",
  showBadge = true,
  className,
}: PriceDisplayProps) {
  const hasDiscount = !!discountPrice && discountPrice < price;
  const displayPrice = hasDiscount ? discountPrice : price;
  const percent = hasDiscount ? discountPercent(price, discountPrice!) : 0;

  return (
    <div className={cn("flex items-center flex-wrap gap-2", className)}>
      {/* Current price */}
      <span className={cn(priceSizeMap[size], "text-[#0F172A]")}>
        {formatPrice(displayPrice)}
      </span>

      {/* Original price */}
      {hasDiscount && (
        <span
          className={cn(
            originalSizeMap[size],
            "text-[#94A3B8] line-through"
          )}
        >
          {formatPrice(price)}
        </span>
      )}

      {/* Discount badge */}
      {hasDiscount && showBadge && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-xs font-600 leading-none">
          -{percent}%
        </span>
      )}
    </div>
  );
}
