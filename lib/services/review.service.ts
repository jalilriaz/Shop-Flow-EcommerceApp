import { Review } from "@/lib/types/review";
import { ApiResponse, CreateReviewInput, ReviewQueryParams } from "@/lib/types/api";
import { dataStore } from "@/lib/data/store";
import { sleep } from "@/lib/utils";

export const reviewService = {
  async getAll(params?: ReviewQueryParams): Promise<ApiResponse<Review[]>> {
    await sleep(150);
    let reviews = dataStore.getReviews();

    if (params?.status) {
      reviews = reviews.filter((r) => r.status === params.status);
    }

    if (params?.productId) {
      reviews = reviews.filter((r) => r.productId === params.productId);
    }

    return {
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    };
  },

  async getByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    await sleep(100);
    const reviews = dataStore.getReviewsByProduct(productId);
    return {
      success: true,
      message: "Product reviews retrieved",
      data: reviews,
    };
  },

  async create(input: CreateReviewInput): Promise<ApiResponse<Review>> {
    await sleep(200);
    const review = dataStore.createReview(input);
    return {
      success: true,
      message: "Review submitted for moderation",
      data: review,
    };
  },

  async updateStatus(id: string, status: "approved" | "rejected"): Promise<ApiResponse<Review>> {
    await sleep(150);
    const review = dataStore.updateReviewStatus(id, status);
    return {
      success: true,
      message: `Review ${status}`,
      data: review,
    };
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await sleep(150);
    dataStore.deleteReview(id);
    return {
      success: true,
      message: "Review deleted",
      data: undefined,
    };
  },
};
