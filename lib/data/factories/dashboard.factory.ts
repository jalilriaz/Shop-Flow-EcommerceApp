import {
  DashboardStats,
  ChartDataPoint,
  CategoryRevenueData,
} from "@/lib/types/api";

export function createDashboardStatsFactory(): DashboardStats {
  return {
    revenue: {
      current: 54320.75,
      previous: 46200.0,
      change: 17.5,
    },
    orders: {
      current: 384,
      previous: 322,
      change: 19.2,
    },
    customers: {
      current: 1420,
      previous: 1210,
      change: 17.3,
    },
    products: {
      current: 248,
      previous: 215,
      change: 15.3,
    },
  };
}

export function createRevenueChartFactory(): ChartDataPoint[] {
  return [
    { month: "Sep", revenue: 31200 },
    { month: "Oct", revenue: 36400 },
    { month: "Nov", revenue: 42100 },
    { month: "Dec", revenue: 58900 },
    { month: "Jan", revenue: 46200 },
    { month: "Feb", revenue: 49800 },
    { month: "Mar", revenue: 54320 },
  ];
}

export function createCategoryRevenueFactory(): CategoryRevenueData[] {
  return [
    { name: "Electronics", value: 42, color: "#7C3AED" },
    { name: "Fashion", value: 24, color: "#8B5CF6" },
    { name: "Home & Living", value: 16, color: "#A78BFA" },
    { name: "Accessories", value: 10, color: "#C4B5FD" },
    { name: "Beauty", value: 5, color: "#DDD6FE" },
    { name: "Sports & Outdoors", value: 3, color: "#EDE9FE" },
  ];
}
