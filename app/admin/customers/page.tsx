"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useCustomers } from "@/lib/hooks/use-customers";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Spinner } from "@/components/shared/Spinner";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const { data: customers = [], isLoading } = useCustomers();

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-[#0F172A]">Customers</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Manage registered customer accounts and order totals</p>
      </div>

      {/* Search */}
      <div className="card-base p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="search"
            placeholder="Search customers by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-600 text-[#475569] uppercase tracking-wide">
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Orders</th>
                <th className="px-5 py-3.5">Total Spent</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-700 overflow-hidden shrink-0">
                        {customer.avatar ? (
                          <Image src={customer.avatar} alt={customer.name} width={36} height={36} className="w-full h-full object-cover" />
                        ) : (
                          customer.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-600 text-[#0F172A]">{customer.name}</p>
                        <p className="text-xs text-[#64748B]">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#475569]">{customer.phone}</td>
                  <td className="px-5 py-3.5 text-sm font-600 text-[#0F172A]">{customer.orderCount} orders</td>
                  <td className="px-5 py-3.5 text-sm font-700 text-[#0F172A]">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={customer.status === "active" ? "active" : "inactive"} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#64748B]">{formatDate(customer.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
