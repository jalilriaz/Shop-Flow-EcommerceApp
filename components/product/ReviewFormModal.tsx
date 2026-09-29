"use client";

import React, { useState } from "react";
import { X, Star, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormModalProps {
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (reviewData: { rating: number; title: string; comment: string; authorName: string }) => void;
}

export function ReviewFormModal({
  productName,
  isOpen,
  onClose,
  onSubmitSuccess,
}: ReviewFormModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !authorName.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate API network latency

    onSubmitSuccess?.({ rating, title, comment, authorName });
    toast.success("Review submitted! Pending admin moderation.");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 animate-scale-in"
        role="dialog"
        aria-labelledby="review-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="review-modal-title" className="text-xl font-bold text-slate-900">
          Write a Review
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Share your experience for <span className="font-semibold text-slate-800">{productName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Overall Rating
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Extremely comfortable & stylish!"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Review Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you liked or disliked about this item..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Verified purchase reviews help our community shop with confidence.</span>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-medium text-xs shadow-xs transition-all flex items-center gap-2 active:scale-95"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
