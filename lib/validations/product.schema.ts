import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().optional(),
  categorySlug: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  discountPrice: z.number().optional(),
  sku: z.string().min(3, "SKU is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  images: z.array(z.string()).min(1, "At least one product image is required"),
  featured: z.boolean(),
  status: z.enum(["active", "draft", "archived"]),
  tags: z.string().or(z.array(z.string())).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
