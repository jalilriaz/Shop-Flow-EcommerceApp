export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
