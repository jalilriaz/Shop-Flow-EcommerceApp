import {
  ApiResponse,
  DashboardStats,
  ChartDataPoint,
  CategoryRevenueData,
} from "@/lib/types/api";
import { dataStore } from "@/lib/data/store";
import { sleep } from "@/lib/utils";

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await sleep(100);
    return {
      success: true,
      message: "Dashboard stats retrieved",
      data: dataStore.getDashboardStats(),
    };
  },

  async getRevenueChart(): Promise<ApiResponse<ChartDataPoint[]>> {
    await sleep(100);
    return {
      success: true,
      message: "Revenue chart data retrieved",
      data: dataStore.getRevenueChart(),
    };
  },

  async getCategoryRevenue(): Promise<ApiResponse<CategoryRevenueData[]>> {
    await sleep(100);
    return {
      success: true,
      message: "Category revenue data retrieved",
      data: dataStore.getCategoryRevenue(),
    };
  },
};
