import { cn } from "@/lib/utils";
import { cn as skeletonCn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-md bg-[#F1F5F9]", className)}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-base overflow-hidden">
      <Skeleton className="w-full aspect-square" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-base p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-[#E2E8F0]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}export function CategoryCardSkeleton() {
  return (
    <div className="card-base p-5 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-[12px]" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
