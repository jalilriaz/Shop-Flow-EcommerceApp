import { Order, OrderStatus } from "@/lib/types/order";
import { Product } from "@/lib/types/product";
import { faker } from "../faker-seed";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function createOrderFactory(products: Product[], count = 20): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
    const customerName = faker.person.fullName();
    const customerEmail = faker.internet.email({ firstName: customerName.split(" ")[0] });
    
    // Pick 1 to 4 random products
    const itemNum = faker.number.int({ min: 1, max: 4 });
    const selectedProducts = faker.helpers.arrayElements(products, itemNum);
    
    const items = selectedProducts.map((p) => {
      const qty = faker.number.int({ min: 1, max: 3 });
      const unitPrice = p.discountPrice ?? p.price;
      return {
        productId: p.id,
        productName: p.name,
        productImage: p.images[0],
        price: unitPrice,
        quantity: qty,
        total: parseFloat((unitPrice * qty).toFixed(2)),
      };
    });

    const subtotal = parseFloat(items.reduce((acc, item) => acc + item.total, 0).toFixed(2));
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const discount = i % 3 === 0 ? parseFloat((subtotal * 0.1).toFixed(2)) : 0;
    const total = parseFloat((subtotal + shipping - discount).toFixed(2));

    const date = faker.date.recent({ days: 60 });

    orders.push({
      id: `ORD-${String(1000 + i).padStart(5, "0")}`,
      customerId: `user-${(i % 5) + 1}`,
      customerName,
      customerEmail,
      items,
      shippingAddress: {
        fullName: customerName,
        email: customerEmail,
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        postalCode: faker.location.zipCode(),
        country: "United States",
      },
      subtotal,
      shipping,
      discount,
      total,
      status,
      paymentStatus: status === "delivered" || status === "shipped" ? "paid" : status === "cancelled" ? "failed" : "pending",
      paymentMethod: i % 2 === 0 ? "Cash on Delivery" : "Credit Card (Stripe)",
      trackingNumber: status === "shipped" || status === "delivered" ? `TRK-${faker.string.alphanumeric(10).toUpperCase()}` : undefined,
      createdAt: date.toISOString(),
      updatedAt: new Date(date.getTime() + 86400000).toISOString(),
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
