import { ApiResponse } from "@/lib/types/api";
import { sleep } from "@/lib/utils";

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  value: number; // e.g. 10 for 10%, 20 for $20 flat
  minOrderValue?: number;
  description: string;
}

const MOCK_COUPONS: Coupon[] = [
  {
    code: "SAVE10",
    discountType: "percentage",
    value: 10,
    minOrderValue: 20,
    description: "10% off on orders over $20",
  },
  {
    code: "FREESHIP",
    discountType: "free_shipping",
    value: 100,
    description: "Free shipping on your order",
  },
  {
    code: "WELCOME20",
    discountType: "fixed",
    value: 20,
    minOrderValue: 50,
    description: "$20 flat discount on orders over $50",
  },
];

export const couponService = {
  async validateCoupon(code: string, subtotal: number): Promise<ApiResponse<Coupon>> {
    await sleep(200); // Simulate network latency

    const found = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());

    if (!found) {
      throw new Error("Invalid or expired coupon code.");
    }

    if (found.minOrderValue && subtotal < found.minOrderValue) {
      throw new Error(`Minimum order amount of $${found.minOrderValue} required for coupon ${found.code}.`);
    }

    return {
      success: true,
      message: `Coupon "${found.code}" applied successfully!`,
      data: found,
    };
  },
};
