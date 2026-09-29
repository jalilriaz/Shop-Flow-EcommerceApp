import { cn, formatPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  period = "vs last month",
  icon: Icon,
  iconColor = "#7C3AED",
  className,
}: StatCardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <div className={cn("card-base p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#64748B] font-500 mb-2">{title}</p>
          <p className="text-2xl font-700 text-[#0F172A] tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              {positive ? (
                <TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />
              )}
              <span
                className={cn(
                  "text-xs font-600",
                  positive ? "text-[#16A34A]" : "text-[#DC2626]"
                )}
              >
                {positive ? "+" : ""}
                {change.toFixed(1)}%
              </span>
              <span className="text-xs text-[#94A3B8]">{period}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div
            className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
          </div>
        )}
      </div>
    </div>
  );
}
