import { Customer } from "@/lib/types/customer";
import { ApiResponse } from "@/lib/types/api";
import { dataStore } from "@/lib/data/store";
import { sleep } from "@/lib/utils";

export const customerService = {
  async getAll(): Promise<ApiResponse<Customer[]>> {
    await sleep(150);
    const customers = dataStore.getCustomers();
    return {
      success: true,
      message: "Customers retrieved successfully",
      data: customers,
    };
  },
};
