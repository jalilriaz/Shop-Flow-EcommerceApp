"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { CartItemCard } from "@/components/shared/CartItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { CouponInput } from "@/components/cart/CouponInput";
import { Coupon } from "@/lib/services/coupon.service";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, shipping, clearCart } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  let discountAmount = 0;
  let effectiveShipping = shipping;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.discountType === "fixed") {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    } else if (appliedCoupon.discountType === "free_shipping") {
      effectiveShipping = 0;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + effectiveShipping);

  if (items.length === 0) {
    return (
      <div className="page-container py-16">
        <h1 className="text-h1 text-[#0F172A] mb-8">Shopping Cart</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Discover something you'll love and add it to your cart."
          action={{ label: "Continue Shopping", href: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-h1 text-[#0F172A] mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Cart items */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E2E8F0]">
            <p className="text-sm font-600 text-[#475569]">{items.length} {items.length === 1 ? "item" : "items"}</p>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-[#EF4444] hover:text-[#DC2626] font-500 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div>
            {items.map((item) => (
              <CartItemCard key={item.productId} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card-base p-6 space-y-4">
            <h2 className="text-base font-700 text-[#0F172A]">Order Summary</h2>

            {/* Coupon Input */}
            <CouponInput
              subtotal={subtotal}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
            />

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Subtotal</span>
                <span className="font-500 text-[#0F172A]">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-700 font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Shipping</span>
                <span className={effectiveShipping === 0 ? "text-[#16A34A] font-500" : "font-500 text-[#0F172A]"}>
                  {effectiveShipping === 0 ? "Free" : formatPrice(effectiveShipping)}
                </span>
              </div>
              {effectiveShipping === 0 && (
                <div className="flex items-center gap-2 text-xs text-[#16A34A] bg-[#F0FDF4] px-3 py-2 rounded-[8px]">
                  <Truck className="w-3.5 h-3.5" />
                  Free shipping applied!
                </div>
              )}
              {effectiveShipping > 0 && (
                <div className="text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-2 rounded-[8px]">
                  Add {formatPrice(100 - subtotal)} more for free shipping
                </div>
              )}
              <div className="pt-3 border-t border-[#E2E8F0] flex justify-between">
                <span className="font-700 text-[#0F172A]">Total</span>
                <span className="font-700 text-[#0F172A] text-lg">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-600 rounded-[10px] transition-colors text-sm"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 w-full py-3 border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] font-600 rounded-[10px] transition-colors text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
