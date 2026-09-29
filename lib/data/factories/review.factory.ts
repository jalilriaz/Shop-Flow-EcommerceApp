import { Review } from "@/lib/types/review";
import { Product } from "@/lib/types/product";
import { faker } from "../faker-seed";

export function createReviewFactory(products: Product[], count = 30): Review[] {
  const reviews: Review[] = [];

  for (let i = 0; i < count; i++) {
    const product = products[i % products.length];
    const customerName = faker.person.fullName();
    const rating = faker.number.int({ min: 3, max: 5 });

    reviews.push({
      id: `rev-${i + 1}`,
      productId: product.id,
      productName: product.name,
      customerId: `user-${(i % 5) + 1}`,
      customerName,
      customerAvatar: faker.image.avatar(),
      rating,
      title: faker.lorem.sentence({ min: 3, max: 7 }),
      body: faker.lorem.paragraph({ min: 2, max: 4 }),
      status: i % 5 === 0 ? "pending" : "approved",
      createdAt: faker.date.recent({ days: 45 }).toISOString(),
    });
  }

  return reviews;
}
