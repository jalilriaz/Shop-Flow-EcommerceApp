"use client";

import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge, orderStatusVariant } from "@/components/shared/StatusBadge";
import { useDashboardStats, useRevenueChart } from "@/lib/hooks/use-dashboard";
import { useOrders } from "@/lib/hooks/use-orders";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spinner } from "@/components/shared/Spinner";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: chartData = [], isLoading: chartLoading } = useRevenueChart();
  const { data: orders = [], isLoading: ordersLoading } = useOrders({ limit: 5 });

  if (statsLoading || chartLoading || ordersLoading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-[#0F172A]">Dashboard Overview</h1>
        <p className="text-sm text-[#64748B] mt-1">Welcome back. Here is your business performance at a glance.</p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats.revenue.current)}
            change={stats.revenue.change}
            icon={DollarSign}
            iconColor="#7C3AED"
          />
          <StatCard
            title="Total Orders"
            value={stats.orders.current}
            change={stats.orders.change}
            icon={ShoppingBag}
            iconColor="#3B82F6"
          />
          <StatCard
            title="Total Customers"
            value={stats.customers.current}
            change={stats.customers.change}
            icon={Users}
            iconColor="#22C55E"
          />
          <StatCard
            title="Active Products"
            value={stats.products.current}
            change={stats.products.change}
            icon={Package}
            iconColor="#F59E0B"
          />
        </div>
      )}

      {/* Charts & Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-700 text-[#0F172A]">Revenue Growth</h2>
              <p className="text-xs text-[#64748B]">Monthly revenue overview</p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatPrice(value), "Revenue"]}
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-700 text-[#0F172A]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-600 text-[#7C3AED] hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="text-xs font-600 text-[#0F172A] hover:text-[#7C3AED]">
                    {order.id}
                  </Link>
                  <p className="text-[11px] text-[#64748B]">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-700 text-[#0F172A]">{formatPrice(order.total)}</p>
                  <StatusBadge variant={orderStatusVariant(order.status)} className="mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
