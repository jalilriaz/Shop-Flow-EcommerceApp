"use client";

import { useState } from "react";
import { Save, Store, Truck, CreditCard, Bell } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: "ShopFlow",
    supportEmail: "support@shopflow.com",
    currency: "USD ($)",
    freeShippingThreshold: "100",
    defaultShippingCost: "9.99",
    codEnabled: true,
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-h2 text-[#0F172A]">Store Settings</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Configure store preferences, shipping rules, and payments</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Settings */}
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-700 text-[#0F172A] mb-2">
            <Store className="w-5 h-5 text-[#7C3AED]" />
            General Store Info
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Store Name</label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-700 text-[#0F172A] mb-2">
            <Truck className="w-5 h-5 text-[#7C3AED]" />
            Shipping Configuration
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Free Shipping Threshold ($)</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Default Shipping Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.defaultShippingCost}
                onChange={(e) => setForm({ ...form, defaultShippingCost: e.target.value })}
                className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center gap-2 text-base font-700 text-[#0F172A] mb-2">
            <CreditCard className="w-5 h-5 text-[#7C3AED]" />
            Payment Gateway
          </div>

          <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-[10px] bg-[#F8FAFC]">
            <div>
              <p className="text-sm font-600 text-[#0F172A]">Cash on Delivery (COD)</p>
              <p className="text-xs text-[#64748B]">Allow customers to pay upon receiving physical package</p>
            </div>
            <input
              type="checkbox"
              checked={form.codEnabled}
              onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })}
              className="w-5 h-5 accent-[#7C3AED] cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-600 rounded-[10px] transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </form>
    </div>
  );
}
