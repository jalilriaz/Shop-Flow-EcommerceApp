import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/lib/services/product.service";
import { ProductQueryParams, CreateProductInput, UpdateProductInput } from "@/lib/types/api";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (params?: ProductQueryParams) => [...PRODUCT_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (slug: string) => [...PRODUCT_KEYS.details(), slug] as const,
  detailById: (id: string) => [...PRODUCT_KEYS.details(), "id", id] as const,
  featured: (limit?: number) => [...PRODUCT_KEYS.all, "featured", limit] as const,
  related: (productId: string, categorySlug: string) =>
    [...PRODUCT_KEYS.all, "related", productId, categorySlug] as const,
};

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => productService.getAll(params),
    select: (res) => res.data,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: () => productService.getBySlug(slug),
    select: (res) => res.data,
    enabled: !!slug,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detailById(id),
    queryFn: () => productService.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: PRODUCT_KEYS.featured(limit),
    queryFn: () => productService.getFeatured(limit),
    select: (res) => res.data,
  });
}

export function useRelatedProducts(productId: string, categorySlug: string, limit = 4) {
  return useQuery({
    queryKey: PRODUCT_KEYS.related(productId, categorySlug),
    queryFn: () => productService.getRelated(productId, categorySlug, limit),
    select: (res) => res.data,
    enabled: !!productId && !!categorySlug,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductInput) => productService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}
