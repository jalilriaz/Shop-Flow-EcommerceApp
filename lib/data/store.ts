import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { Order, OrderStatus } from "@/lib/types/order";
import { Review } from "@/lib/types/review";
import { Customer } from "@/lib/types/customer";
import {
  DashboardStats,
  ChartDataPoint,
  CategoryRevenueData,
  CreateProductInput,
  UpdateProductInput,
  CreateOrderInput,
  CreateCategoryInput,
  CreateReviewInput,
} from "@/lib/types/api";
import {
  createCategoryFactory,
  createProductFactory,
  createOrderFactory,
  createReviewFactory,
  createCustomerFactory,
  createDashboardStatsFactory,
  createRevenueChartFactory,
  createCategoryRevenueFactory,
} from "./factories";

class DataStore {
  private categories: Category[];
  private products: Product[];
  private orders: Order[];
  private reviews: Review[];
  private customers: Customer[];
  private stats: DashboardStats;
  private revenueChart: ChartDataPoint[];
  private categoryRevenue: CategoryRevenueData[];

  constructor() {
    this.categories = createCategoryFactory();
    this.products = createProductFactory(48);
    this.orders = createOrderFactory(this.products, 25);
    this.reviews = createReviewFactory(this.products, 30);
    this.customers = createCustomerFactory(15);
    this.stats = createDashboardStatsFactory();
    this.revenueChart = createRevenueChartFactory();
    this.categoryRevenue = createCategoryRevenueFactory();

    // Calculate product counts per category
    this.recalculateCategoryCounts();
  }

  private recalculateCategoryCounts() {
    this.categories.forEach((cat) => {
      cat.productCount = this.products.filter((p) => p.categorySlug === cat.slug).length;
    });
  }

  // --- PRODUCTS ---
  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  getProductsByCategory(categorySlug: string): Product[] {
    return this.products.filter((p) => p.categorySlug === categorySlug);
  }

  getFeaturedProducts(limit = 8): Product[] {
    return this.products.filter((p) => p.featured).slice(0, limit);
  }

  getRelatedProducts(productId: string, categorySlug: string, limit = 4): Product[] {
    return this.products
      .filter((p) => p.categorySlug === categorySlug && p.id !== productId)
      .slice(0, limit);
  }

  createProduct(input: CreateProductInput): Product {
    const slug = input.categorySlug
      ? `${input.categorySlug}-${Date.now().toString(36)}`
      : `product-${Date.now().toString(36)}`;
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.products.unshift(newProduct);
    this.recalculateCategoryCounts();
    return newProduct;
  }

  updateProduct(input: UpdateProductInput): Product {
    const index = this.products.findIndex((p) => p.id === input.id);
    if (index === -1) throw new Error("Product not found");
    this.products[index] = { ...this.products[index], ...input };
    this.recalculateCategoryCounts();
    return this.products[index];
  }

  deleteProduct(id: string): void {
    this.products = this.products.filter((p) => p.id !== id);
    this.recalculateCategoryCounts();
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    return [...this.categories];
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  createCategory(input: CreateCategoryInput): Category {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      productCount: 0,
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.categories.push(newCat);
    return newCat;
  }

  deleteCategory(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  createOrder(input: CreateOrderInput, customerId = "user-1"): Order {
    const subtotal = input.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const total = parseFloat((subtotal + shipping).toFixed(2));

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId,
      customerName: input.shippingAddress.fullName,
      customerEmail: input.shippingAddress.email,
      items: input.items.map((i) => ({
        ...i,
        total: parseFloat((i.price * i.quantity).toFixed(2)),
      })),
      shippingAddress: input.shippingAddress,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping,
      discount: 0,
      total,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: input.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(id: string, status: OrderStatus): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  // --- REVIEWS ---
  getReviews(): Review[] {
    return [...this.reviews];
  }

  getReviewsByProduct(productId: string): Review[] {
    return this.reviews.filter((r) => r.productId === productId && r.status === "approved");
  }

  createReview(input: CreateReviewInput, customerName = "Verified Customer"): Review {
    const product = this.getProductById(input.productId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: input.productId,
      productName: product?.name ?? "Product",
      customerId: "user-1",
      customerName,
      rating: input.rating,
      title: input.title,
      body: input.body,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  updateReviewStatus(id: string, status: "approved" | "rejected"): Review {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) throw new Error("Review not found");
    review.status = status;
    return review;
  }

  deleteReview(id: string): void {
    this.reviews = this.reviews.filter((r) => r.id !== id);
  }

  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  // --- DASHBOARD ---
  getDashboardStats(): DashboardStats {
    return { ...this.stats };
  }

  getRevenueChart(): ChartDataPoint[] {
    return [...this.revenueChart];
  }

  getCategoryRevenue(): CategoryRevenueData[] {
    return [...this.categoryRevenue];
  }
}

// Global singleton instance
export const dataStore = new DataStore();
