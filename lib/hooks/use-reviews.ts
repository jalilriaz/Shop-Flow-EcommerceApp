import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/lib/services/review.service";
import { ReviewQueryParams, CreateReviewInput } from "@/lib/types/api";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  list: (params?: ReviewQueryParams) => [...REVIEW_KEYS.all, "list", params] as const,
  byProduct: (productId: string) => [...REVIEW_KEYS.all, "product", productId] as const,
};

export function useReviews(params?: ReviewQueryParams) {
  return useQuery({
    queryKey: REVIEW_KEYS.list(params),
    queryFn: () => reviewService.getAll(params),
    select: (res) => res.data,
  });
}

export function useReviewsByProduct(productId: string) {
  return useQuery({
    queryKey: REVIEW_KEYS.byProduct(productId),
    queryFn: () => reviewService.getByProduct(productId),
    select: (res) => res.data,
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      reviewService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
  });
}
