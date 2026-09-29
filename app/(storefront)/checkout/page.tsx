"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/lib/validations/checkout.schema";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCreateOrder } from "@/lib/hooks/use-orders";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { StripeCardElement } from "@/components/checkout/StripeCardElement";

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const [placedOrder, setPlacedOrder] = useState<{ id: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
    },
  });

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products before checking out."
          action={{ label: "Browse Products", href: "/products" }}
        />
      </div>
    );
  }

  async function onSubmit(data: CheckoutFormData) {
    try {
      const order = await createOrderMutation.mutateAsync({
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          productImage: i.image,
          price: i.discountPrice ?? i.price,
          quantity: i.quantity,
        })),
        shippingAddress: data,
        paymentMethod: "Cash on Delivery",
      });

      setPlacedOrder({ id: order.data.id });
      clearCart();
      toast.success("Order placed successfully!", { description: `Order ${order.data.id}` });
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    }
  }

  if (placedOrder) {
    return (
      <div className="page-container py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#16A34A]" />
          </div>
          <h1 className="text-h2 text-[#0F172A] mb-3">Order Placed!</h1>
          <p className="text-[#64748B] text-body mb-2">Thank you for your order. We&apos;ll confirm shortly.</p>
          <p className="text-sm font-600 text-[#7C3AED] mb-8">Order ID: {placedOrder.id}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="px-6 py-3 bg-[#7C3AED] text-white font-600 rounded-[10px] text-sm">
              Track Order
            </Link>
            <Link href="/products" className="px-6 py-3 border border-[#E2E8F0] text-[#475569] font-600 rounded-[10px] text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-h1 text-[#0F172A] mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Shipping form */}
          <div className="space-y-6">
            <div className="card-base p-6">
              <h2 className="text-base font-700 text-[#0F172A] mb-5">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Full Name *</label>
                  <input
                    {...register("fullName")}
                    placeholder="John Doe"
                    className={ `w-full h-12 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                      errors.fullName ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                    }` }
                  />
                  {errors.fullName && <p className="text-xs text-[#EF4444] mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className={ `w-full h-12 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                      errors.email ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                    }` }
                  />
                  {errors.email && <p className="text-xs text-[#EF4444] mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={ `w-full h-12 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                      errors.phone ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                    }` }
                  />
                  {errors.phone && <p className="text-xs text-[#EF4444] mt-1">{errors.phone.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Street Address *</label>
                  <input
                    {...register("address")}
                    placeholder="742 Evergreen Terrace"
                    className={ `w-full h-12 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                      errors.address ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                    }` }
                  />
                  {errors.address && <p className="text-xs text-[#EF4444] mt-1">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">City *</label>
                  <input
                    {...register("city")}
                    placeholder="Springfield"
                    className={ `w-full h-12 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                      errors.city ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                    }` }
                  />
                  {errors.city && <p className="text-xs text-[#EF4444] mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">State / Province *</label>
                  <input
                    {...register("state")}
                    placeholder="IL"
                    className={ `w-full h-12 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                      errors.state ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                    }` }
                  />
                  {errors.state && <p className="text-xs text-[#EF4444] mt-1">{errors.state.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Postal Code *</label>
                  <input
                    {...register("postalCode")}
                    placeholder="62701"
                    className={ `w-full h-12 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none transition-colors ${
                      errors.postalCode ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                    }` }
                  />
                  {errors.postalCode && <p className="text-xs text-[#EF4444] mt-1">{errors.postalCode.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-600 text-[#475569] mb-1.5">Country *</label>
                  <select
                    {...register("country")}
                    className="w-full h-12 px-4 border border-[#CBD5E1] focus:border-[#8B5CF6] rounded-[10px] text-sm text-[#0F172A] bg-white focus:outline-none transition-colors"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Pakistan</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="card-base p-6 space-y-4">
              <h2 className="text-base font-700 text-[#0F172A]">Payment Method</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                    paymentMethod === "cod"
                      ? "border-emerald-700 bg-emerald-50/60"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                      paymentMethod === "cod"
                        ? "bg-emerald-800 border-emerald-800 text-white"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {paymentMethod === "cod" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Cash on Delivery</p>
                    <p className="text-[11px] text-slate-500">Pay when order arrives</p>
                  </div>
                </button>

                {/* Credit Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                    paymentMethod === "card"
                      ? "border-emerald-700 bg-emerald-50/60"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                      paymentMethod === "card"
                        ? "bg-emerald-800 border-emerald-800 text-white"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {paymentMethod === "card" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Credit / Debit Card</p>
                    <p className="text-[11px] text-slate-500">Stripe Encrypted Payment</p>
                  </div>
                </button>
              </div>

              {/* Stripe Credit Card Inputs */}
              {paymentMethod === "card" && <StripeCardElement />}
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="card-base p-6 sticky top-24">
              <h2 className="text-base font-700 text-[#0F172A] mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded-[8px] bg-[#F8FAFC] overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-600 text-[#0F172A] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-[#64748B]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-700 text-[#0F172A] whitespace-nowrap">
                      {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Subtotal</span>
                  <span className="font-500">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Shipping</span>
                  <span className={shipping === 0 ? "text-[#16A34A] font-500" : "font-500"}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-700 text-[#0F172A] pt-2 border-t border-[#E2E8F0]">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-[#C4B5FD] text-white font-600 rounded-[10px] transition-colors text-sm"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
