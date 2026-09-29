"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function Rating({
  value,
  count,
  size = "md",
  showCount = true,
  className,
}: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(value);
    const half = !filled && i < value;
    return { filled, half };
  });

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((star, i) => (
          <div key={i} className="relative">
            {/* Background star (empty) */}
            <Star
              className={cn(sizeMap[size], "fill-neutral-200 stroke-none")}
            />
            {/* Foreground star */}
            {(star.filled || star.half) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: star.half ? "50%" : "100%" }}
              >
                <Star
                  className={cn(sizeMap[size], "fill-[#F59E0B] stroke-none")}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {showCount && (
        <span className={cn(textSizeMap[size], "text-[#64748B]")}>
          {value.toFixed(1)}
          {count !== undefined && (
            <span className="ml-1">({count.toLocaleString()})</span>
          )}
        </span>
      )}
    </div>
  );
}
