"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { CartItem as CartItemType } from "@/lib/types/cart";
import { QuantitySelector } from "./QuantitySelector";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export function CartItemCard({ item, className }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const effectivePrice = item.discountPrice ?? item.price;

  return (
    <div className={cn("flex gap-4 py-4 border-b border-[#E2E8F0] last:border-0", className)}>
      {/* Image */}
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[12px] bg-[#F8FAFC] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="w-full h-full object-contain p-2"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${item.productId}`}>
            <h3 className="text-sm font-600 text-[#0F172A] line-clamp-2 hover:text-[#7C3AED] transition-colors">
              {item.name}
            </h3>
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label="Remove item"
            className="w-8 h-8 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={item.stock}
            onChange={(q) => updateQuantity(item.productId, q)}
            size="sm"
          />
          <div className="text-right">
            <p className="text-base font-700 text-[#0F172A]">
              {formatPrice(effectivePrice * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-[#64748B]">
                {formatPrice(effectivePrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
