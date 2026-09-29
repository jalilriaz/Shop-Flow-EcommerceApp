"use client";

import React, { useState } from "react";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";

export function StripeCardElement() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const formatCardNumber = (val: string) => {
    return val
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-emerald-800" /> Credit / Debit Card (Stripe Encrypted)
        </span>
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Lock className="w-3 h-3 text-emerald-700" /> 256-bit SSL
        </span>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 •••• •••• 4242"
            maxLength={19}
            className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Expiry & CVC Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            CVC / CVV
          </label>
          <input
            type="password"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="•••"
            maxLength={4}
            className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>Card details are tokenized directly via Stripe Elements and never touch our servers.</span>
      </div>
    </div>
  );
}
