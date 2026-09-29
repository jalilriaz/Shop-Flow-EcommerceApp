import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/lib/services/customer.service";

export const CUSTOMER_KEYS = {
  all: ["customers"] as const,
};

export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMER_KEYS.all,
    queryFn: () => customerService.getAll(),
    select: (res) => res.data,
  });
}
