import { Product } from "@/lib/types/product";
import { faker } from "../faker-seed";
import { CATEGORY_DEFINITIONS } from "./category.factory";

const PRODUCT_IMAGE_POOL: Record<string, string[]> = {
  electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  ],
  "home-living": [
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  ],
  "sports-outdoors": [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  ],
};

const BRANDS = [
  "Sony", "Apple", "Samsung", "Nike", "Adidas", "Bose",
  "Nordic", "Anker", "Logitech", "Dyson", "Patagonia", "Aesop",
];

export function createProductFactory(count = 48): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const categoryDef = CATEGORY_DEFINITIONS[i % CATEGORY_DEFINITIONS.length];
    const brand = faker.helpers.arrayElement(BRANDS);
    const noun = faker.commerce.productName();
    const name = `${brand} ${noun}`;
    const slug = faker.helpers.slugify(name.toLowerCase()) + `-${i + 1}`;
    const basePrice = parseFloat(faker.commerce.price({ min: 19, max: 1200, dec: 2 }));
    const hasDiscount = faker.datatype.boolean({ probability: 0.4 });
    const discountPrice = hasDiscount
      ? parseFloat((basePrice * faker.number.float({ min: 0.7, max: 0.9 })).toFixed(2))
      : undefined;

    const imagesPool = PRODUCT_IMAGE_POOL[categoryDef.slug] || PRODUCT_IMAGE_POOL.electronics;
    const primaryImg = imagesPool[i % imagesPool.length];
    const secondaryImg = imagesPool[(i + 1) % imagesPool.length];

    const stock = faker.number.int({ min: 0, max: 75 });
    const rating = parseFloat(faker.number.float({ min: 3.8, max: 5.0, fractionDigits: 1 }).toFixed(1));
    const reviewCount = faker.number.int({ min: 12, max: 1850 });

    products.push({
      id: `prod-${i + 1}`,
      slug,
      name,
      description: faker.commerce.productDescription() + ". Engineered for durability, maximum efficiency, and everyday comfort.",
      category: categoryDef.name,
      categorySlug: categoryDef.slug,
      brand,
      price: basePrice,
      discountPrice,
      sku: `${brand.slice(0, 3).toUpperCase()}-${faker.string.alphanumeric(6).toUpperCase()}`,
      stock,
      images: [primaryImg, secondaryImg],
      rating,
      reviewCount,
      featured: i < 8 || faker.datatype.boolean({ probability: 0.2 }),
      status: "active",
      specifications: {
        Material: faker.commerce.productMaterial(),
        Warranty: "1 Year Limited",
        Origin: "Imported",
        Weight: `${faker.number.int({ min: 100, max: 2500 })} g`,
      },
      tags: [categoryDef.slug, brand.toLowerCase(), "featured"],
      createdAt: faker.date.past({ years: 1 }).toISOString(),
    });
  }

  return products;
}
