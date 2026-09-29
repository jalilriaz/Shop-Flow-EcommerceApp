import { Category } from "@/lib/types/category";
import { ApiResponse, CreateCategoryInput } from "@/lib/types/api";
import { dataStore } from "@/lib/data/store";
import { sleep } from "@/lib/utils";

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    await sleep(100);
    const categories = dataStore.getCategories();
    return {
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    };
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    await sleep(100);
    const category = dataStore.getCategoryBySlug(slug);
    if (!category) {
      throw new Error("Category not found");
    }
    return {
      success: true,
      message: "Category details retrieved",
      data: category,
    };
  },

  async create(input: CreateCategoryInput): Promise<ApiResponse<Category>> {
    await sleep(150);
    const category = dataStore.createCategory(input);
    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await sleep(150);
    dataStore.deleteCategory(id);
    return {
      success: true,
      message: "Category deleted successfully",
      data: undefined,
    };
  },
};
