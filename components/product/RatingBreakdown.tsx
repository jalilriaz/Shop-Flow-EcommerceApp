"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingBreakdownProps {
  ratingAvg: number;
  reviewCount: number;
  onWriteReviewClick?: () => void;
}

export function RatingBreakdown({
  ratingAvg,
  reviewCount,
  onWriteReviewClick,
}: RatingBreakdownProps) {
  // Mock distribution calculations
  const distributions = [
    { stars: 5, percentage: 70, count: Math.round(reviewCount * 0.7) },
    { stars: 4, percentage: 20, count: Math.round(reviewCount * 0.2) },
    { stars: 3, percentage: 6, count: Math.round(reviewCount * 0.06) },
    { stars: 2, percentage: 3, count: Math.round(reviewCount * 0.03) },
    { stars: 1, percentage: 1, count: Math.round(reviewCount * 0.01) },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">{ratingAvg.toFixed(1)}</span>
            <span className="text-sm text-slate-500 font-medium">out of 5</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(ratingAvg) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
              />
            ))}
            <span className="text-xs font-semibold text-slate-600 ml-2">
              Based on {reviewCount} reviews
            </span>
          </div>
        </div>

        {onWriteReviewClick && (
          <button
            type="button"
            onClick={onWriteReviewClick}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Progress Bars */}
      <div className="space-y-2.5">
        {distributions.map((item) => (
          <div key={item.stars} className="flex items-center gap-3 text-xs">
            <span className="w-12 font-medium text-slate-600 flex items-center gap-1">
              {item.stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="w-8 text-right font-mono text-slate-400">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
