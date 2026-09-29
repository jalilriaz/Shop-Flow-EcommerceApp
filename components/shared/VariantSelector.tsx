"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColorOption {
  name: string;
  hex: string;
}

interface VariantSelectorProps {
  sizes?: string[];
  colors?: ColorOption[];
  selectedSize?: string;
  selectedColor?: string;
  onSelectSize?: (size: string) => void;
  onSelectColor?: (color: string) => void;
  disabledSizes?: string[];
  disabledColors?: string[];
  className?: string;
}

export function VariantSelector({
  sizes = ["XS", "S", "M", "L", "XL"],
  colors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Navy", hex: "#1E3A8A" },
    { name: "Forest", hex: "#1F4D3A" },
  ],
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
  disabledSizes = [],
  disabledColors = [],
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-900">
              Color: <span className="text-slate-600 font-normal">{selectedColor || "Select color"}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Color selector">
            {colors.map((color) => {
              const isSelected = selectedColor === color.name;
              const isDisabled = disabledColors.includes(color.name);

              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => !isDisabled && onSelectColor?.(color.name)}
                  disabled={isDisabled}
                  title={color.name}
                  aria-checked={isSelected}
                  role="radio"
                  className={cn(
                    "relative h-8 w-8 rounded-full flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
                    isSelected
                      ? "ring-2 ring-emerald-600 ring-offset-2 scale-110"
                      : "hover:scale-105 border border-slate-300",
                    isDisabled && "opacity-40 cursor-not-allowed"
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check
                      className={cn(
                        "w-4 h-4 stroke-[3]",
                        color.hex.toLowerCase() === "#ffffff" || color.hex.toLowerCase() === "#fff"
                          ? "text-slate-900"
                          : "text-white"
                      )}
                    />
                  )}
                  <span className="sr-only">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-900">
              Size: <span className="text-slate-600 font-normal">{selectedSize || "Select size"}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size selector">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              const isDisabled = disabledSizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => !isDisabled && onSelectSize?.(size)}
                  disabled={isDisabled}
                  aria-checked={isSelected}
                  role="radio"
                  className={cn(
                    "min-w-11 h-10 px-3 text-sm font-medium rounded-lg border transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                    isSelected
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50",
                    isDisabled && "opacity-40 cursor-not-allowed line-through bg-slate-100 border-slate-200"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
