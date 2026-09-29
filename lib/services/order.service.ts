import { Order, OrderStatus } from "@/lib/types/order";
import { ApiResponse, CreateOrderInput, OrderQueryParams } from "@/lib/types/api";
import { dataStore } from "@/lib/data/store";
import { sleep } from "@/lib/utils";

export const orderService = {
  async getAll(params?: OrderQueryParams): Promise<ApiResponse<Order[]>> {
    await sleep(150);
    let orders = dataStore.getOrders();

    if (params?.status && params.status !== "all") {
      orders = orders.filter((o) => o.status === params.status);
    }

    if (params?.customerId) {
      orders = orders.filter((o) => o.customerId === params.customerId);
    }

    return {
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
      meta: {
        page: params?.page ?? 1,
        limit: params?.limit ?? orders.length,
        total: orders.length,
        totalPages: 1,
      },
    };
  },

  async getById(id: string): Promise<ApiResponse<Order>> {
    await sleep(100);
    const order = dataStore.getOrderById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return {
      success: true,
      message: "Order details retrieved",
      data: order,
    };
  },

  async create(input: CreateOrderInput): Promise<ApiResponse<Order>> {
    await sleep(300);
    const order = dataStore.createOrder(input);
    return {
      success: true,
      message: "Order placed successfully",
      data: order,
    };
  },

  async updateStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    await sleep(150);
    const order = dataStore.updateOrderStatus(id, status);
    return {
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    };
  },
};
