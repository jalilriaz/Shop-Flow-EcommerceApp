export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: "active" | "draft" | "archived";
  specifications: Record<string, string>;
  tags: string[];
  createdAt: string;
}

export type ProductStatus = Product["status"];
