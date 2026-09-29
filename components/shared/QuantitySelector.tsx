"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  size = "md",
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const isMin = value <= min;
  const isMax = value >= max;

  const btnClass = cn(
    "flex items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#0F172A]",
    "transition-colors duration-150 select-none",
    "hover:bg-[#F1F5F9] active:bg-[#E2E8F0]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    size === "sm" ? "w-8 h-8" : "w-10 h-10",
    "min-w-[44px] min-h-[44px]"
  );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0 rounded-[10px] border border-[#E2E8F0] bg-white overflow-hidden",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || isMin}
        onClick={() => onChange(value - 1)}
        className={cn(btnClass, "border-0 border-r border-[#E2E8F0] rounded-none")}
      >
        <Minus className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      </button>

      <span
        className={cn(
          "min-w-[44px] text-center font-600 text-[#0F172A] tabular-nums",
          size === "sm" ? "text-sm px-2" : "text-base px-3"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || isMax}
        onClick={() => onChange(value + 1)}
        className={cn(btnClass, "border-0 border-l border-[#E2E8F0] rounded-none")}
      >
        <Plus className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      </button>
    </div>
  );
}
