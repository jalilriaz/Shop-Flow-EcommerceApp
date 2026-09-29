import { Category } from "@/lib/types/category";

export const CATEGORY_DEFINITIONS = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets, audio gear, smart devices and tech accessories.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Curated apparel, footwear, and stylish everyday wardrobe essentials.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Modern furniture, minimal decor, cookware, and smart home items.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Bags, timepieces, eyewear, and premium personal carrying goods.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Clean skincare, natural cosmetics, and daily self-care rituals.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Fitness equipment, athletic apparel, and outdoor exploration gear.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
  },
];

export function createCategoryFactory(): Category[] {
  return CATEGORY_DEFINITIONS.map((def, index) => ({
    id: `cat-${index + 1}`,
    slug: def.slug,
    name: def.name,
    description: def.description,
    image: def.image,
    productCount: 0, // Calculated dynamically by store
    status: "active",
    createdAt: new Date(2024, 0, 1 + index).toISOString(),
  }));
}
