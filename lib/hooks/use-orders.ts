import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/lib/services/order.service";
import { OrderQueryParams, CreateOrderInput } from "@/lib/types/api";
import { OrderStatus } from "@/lib/types/order";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  list: (params?: OrderQueryParams) => [...ORDER_KEYS.all, "list", params] as const,
  detail: (id: string) => [...ORDER_KEYS.all, "detail", id] as const,
};

export function useOrders(params?: OrderQueryParams) {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => orderService.getAll(params),
    select: (res) => res.data,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => orderService.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => orderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
  });
}
