"use client";

import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { useReviews, useUpdateReviewStatus, useDeleteReview } from "@/lib/hooks/use-reviews";
import { Rating } from "@/components/shared/Rating";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/Spinner";

export default function AdminReviewsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { data: reviews = [], isLoading } = useReviews(
    filterStatus !== "all" ? { status: filterStatus as any } : undefined
  );

  const updateStatusMutation = useUpdateReviewStatus();
  const deleteReviewMutation = useDeleteReview();

  function handleStatus(id: string, status: "approved" | "rejected") {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Review ${status}`),
        onError: (err: any) => toast.error(err.message || "Failed to update review"),
      }
    );
  }

  function handleDelete(id: string) {
    if (confirm("Delete this review permanently?")) {
      deleteReviewMutation.mutate(id, {
        onSuccess: () => toast.success("Review deleted"),
        onError: (err: any) => toast.error(err.message || "Failed to delete review"),
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-[#0F172A]">Review Moderation</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Approve, reject, or moderate submitted customer product reviews</p>
      </div>

      {/* Filter Bar */}
      <div className="flex border-b border-[#E2E8F0]">
        {["all", "pending", "approved", "rejected"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-3 text-sm font-600 border-b-2 capitalize transition-colors ${
              filterStatus === st
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-600 text-[#475569] uppercase tracking-wide">
                <th className="px-5 py-3.5">Product & Review</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5 max-w-sm">
                    <p className="text-xs font-700 text-[#7C3AED] line-clamp-1">{rev.productName}</p>
                    <p className="text-sm font-600 text-[#0F172A] mt-0.5">{rev.title}</p>
                    <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5 leading-relaxed">{rev.body}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-600 text-[#0F172A]">{rev.customerName}</td>
                  <td className="px-5 py-3.5">
                    <Rating value={rev.rating} size="sm" showCount={false} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={rev.status === "approved" ? "approved" : rev.status === "rejected" ? "rejected" : "pending"} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#64748B]">{formatDate(rev.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {rev.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleStatus(rev.id, "approved")}
                          className="p-1.5 text-[#16A34A] hover:bg-[#DCFCE7] rounded-[6px]"
                          title="Approve Review"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {rev.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleStatus(rev.id, "rejected")}
                          className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded-[6px]"
                          title="Reject Review"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-[6px]"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
