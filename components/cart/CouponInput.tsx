"use client";

import React, { useState } from "react";
import { Tag, Check, X, Loader2 } from "lucide-react";
import { couponService, Coupon } from "@/lib/services/coupon.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CouponInputProps {
  subtotal: number;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  className?: string;
}

export function CouponInput({
  subtotal,
  appliedCoupon,
  onApplyCoupon,
  className,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await couponService.validateCoupon(code, subtotal);
      onApplyCoupon(res.data);
      toast.success(res.message);
      setCode("");
    } catch (err: any) {
      toast.error(err.message || "Failed to apply coupon.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onApplyCoupon(null);
    toast.info("Coupon removed.");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-900 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-950 uppercase">{appliedCoupon.code}</p>
              <p className="text-emerald-700 text-[11px]">{appliedCoupon.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors"
            title="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Promo code (try SAVE10)"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono tracking-wide"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim() || isLoading}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
          </button>
        </form>
      )}
    </div>
  );
}
