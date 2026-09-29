import { Customer } from "@/lib/types/customer";
import { faker } from "../faker-seed";

export function createCustomerFactory(count = 15): Customer[] {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    customers.push({
      id: `cust-${i + 1}`,
      name,
      email: faker.internet.email({ firstName: name.split(" ")[0] }),
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
      orderCount: faker.number.int({ min: 1, max: 24 }),
      totalSpent: parseFloat(faker.commerce.price({ min: 120, max: 4500, dec: 2 })),
      status: i % 8 === 0 ? "inactive" : "active",
      joinedAt: faker.date.past({ years: 2 }).toISOString(),
    });
  }

  return customers;
}
