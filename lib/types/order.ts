export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: "paid" | "pending" | "failed";
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
