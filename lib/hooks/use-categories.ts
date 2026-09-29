import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/lib/services/category.service";
import { CreateCategoryInput } from "@/lib/types/api";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  detail: (slug: string) => [...CATEGORY_KEYS.all, "detail", slug] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.lists(),
    queryFn: () => categoryService.getAll(),
    select: (res) => res.data,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(slug),
    queryFn: () => categoryService.getBySlug(slug),
    select: (res) => res.data,
    enabled: !!slug,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}
