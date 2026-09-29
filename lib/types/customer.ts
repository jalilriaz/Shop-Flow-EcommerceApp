export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  orderCount: number;
  totalSpent: number;
  status: "active" | "inactive" | "banned";
  joinedAt: string;
}
