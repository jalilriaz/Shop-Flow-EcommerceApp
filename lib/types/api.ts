/** Standardized API response types matching the backend spec */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors: string[];
}

/** Query parameters for paginated product listing */
export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  status?: "active" | "draft" | "archived";
}

/** Query parameters for order listing */
export interface OrderQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  customerId?: string;
}

/** Query parameters for review listing */
export interface ReviewQueryParams {
  productId?: string;
  status?: "pending" | "approved" | "rejected";
  rating?: number;
  page?: number;
  limit?: number;
}

/** Input types for mutations */
export interface CreateProductInput {
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  featured: boolean;
  status: "active" | "draft" | "archived";
  specifications: Record<string, string>;
  tags: string[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface CreateOrderInput {
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "active" | "inactive";
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title: string;
  body: string;
}

/** Dashboard stat shape */
export interface DashboardStat {
  current: number;
  previous: number;
  change: number;
}

export interface DashboardStats {
  revenue: DashboardStat;
  orders: DashboardStat;
  customers: DashboardStat;
  products: DashboardStat;
}

export interface ChartDataPoint {
  month: string;
  revenue?: number;
  orders?: number;
}

export interface CategoryRevenueData {
  name: string;
  value: number;
  color: string;
}

export interface RecentOrderSummary {
  id: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}
