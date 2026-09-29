"use client";

import React from "react";
import { X, Printer, Download, CheckCircle2 } from "lucide-react";
import { Order } from "@/lib/types/order";
import { formatPrice } from "@/lib/utils";

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderInvoiceModal({ order, isOpen, onClose }: OrderInvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white print:static">
      {/* Backdrop */}
      <div className="absolute inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      {/* Invoice Card */}
      <div
        className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8 max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none print:p-0 animate-scale-in"
        role="dialog"
        aria-labelledby="invoice-modal-title"
      >
        {/* Action Header - Hidden during window.print() */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">Tax Invoice / Receipt</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Paid
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="space-y-6 text-slate-900 font-sans">
          {/* Header Branding */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">ShopFlow</h1>
              <p className="text-xs text-slate-500">Official Purchase Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">Invoice #{order.id}</p>
              <p className="text-xs text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <p className="font-semibold text-slate-700 uppercase tracking-wider mb-1">Customer Info</p>
              <p className="font-medium text-slate-900">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.email}</p>
              <p className="text-slate-600">{order.shippingAddress.phone}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700 uppercase tracking-wider mb-1">Shipping Address</p>
              <p className="text-slate-600">{order.shippingAddress.address}</p>
              <p className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-slate-600">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-medium text-slate-900">{item.productName}</td>
                  <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-600">{formatPrice(item.price)}</td>
                  <td className="py-3 text-right font-semibold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-48 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Thank you for shopping with ShopFlow! For questions, contact support@shopflow.com
          </div>
        </div>
      </div>
    </div>
  );
}
