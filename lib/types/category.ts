export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
}
