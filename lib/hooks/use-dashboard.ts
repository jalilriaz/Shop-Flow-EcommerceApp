import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/lib/services/dashboard.service";

export const DASHBOARD_KEYS = {
  stats: ["dashboard", "stats"] as const,
  revenueChart: ["dashboard", "revenue-chart"] as const,
  categoryRevenue: ["dashboard", "category-revenue"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats,
    queryFn: () => dashboardService.getStats(),
    select: (res) => res.data,
  });
}

export function useRevenueChart() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.revenueChart,
    queryFn: () => dashboardService.getRevenueChart(),
    select: (res) => res.data,
  });
}

export function useCategoryRevenue() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.categoryRevenue,
    queryFn: () => dashboardService.getCategoryRevenue(),
    select: (res) => res.data,
  });
}
