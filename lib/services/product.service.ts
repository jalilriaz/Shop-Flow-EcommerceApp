import { Product } from "@/lib/types/product";
import {
  ApiResponse,
  ProductQueryParams,
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/types/api";
import { dataStore } from "@/lib/data/store";
import { sleep } from "@/lib/utils";

/**
 * Product Service API abstraction layer.
 * Currently uses dataStore (faker). Later: swap implementation to fetch('/api/products')
 */
export const productService = {
  async getAll(params?: ProductQueryParams): Promise<ApiResponse<Product[]>> {
    await sleep(150); // Simulate network latency
    let products = dataStore.getProducts();

    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (params?.category && params.category !== "all") {
      products = products.filter((p) => p.categorySlug === params.category);
    }

    if (params?.minPrice !== undefined) {
      products = products.filter((p) => (p.discountPrice ?? p.price) >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined && params.maxPrice !== Infinity) {
      products = products.filter((p) => (p.discountPrice ?? p.price) <= params.maxPrice!);
    }

    if (params?.sort) {
      switch (params.sort) {
        case "price-asc":
          products.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
          break;
        case "price-desc":
          products.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
          break;
        case "newest":
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
        default:
          products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }
    }

    return {
      success: true,
      message: "Products retrieved successfully",
      data: products,
      meta: {
        page: params?.page ?? 1,
        limit: params?.limit ?? products.length,
        total: products.length,
        totalPages: 1,
      },
    };
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    await sleep(100);
    const product = dataStore.getProductBySlug(slug);
    if (!product) {
      throw new Error("Product not found");
    }
    return {
      success: true,
      message: "Product details retrieved",
      data: product,
    };
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    await sleep(100);
    const product = dataStore.getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return {
      success: true,
      message: "Product details retrieved",
      data: product,
    };
  },

  async getFeatured(limit = 8): Promise<ApiResponse<Product[]>> {
    await sleep(120);
    const products = dataStore.getFeaturedProducts(limit);
    return {
      success: true,
      message: "Featured products retrieved",
      data: products,
    };
  },

  async getRelated(productId: string, categorySlug: string, limit = 4): Promise<ApiResponse<Product[]>> {
    await sleep(120);
    const products = dataStore.getRelatedProducts(productId, categorySlug, limit);
    return {
      success: true,
      message: "Related products retrieved",
      data: products,
    };
  },

  async create(input: CreateProductInput): Promise<ApiResponse<Product>> {
    await sleep(200);
    const product = dataStore.createProduct(input);
    return {
      success: true,
      message: "Product created successfully",
      data: product,
    };
  },

  async update(input: UpdateProductInput): Promise<ApiResponse<Product>> {
    await sleep(200);
    const product = dataStore.updateProduct(input);
    return {
      success: true,
      message: "Product updated successfully",
      data: product,
    };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await sleep(150);
    dataStore.deleteProduct(id);
    return {
      success: true,
      message: "Product deleted successfully",
      data: undefined,
    };
  },
};
