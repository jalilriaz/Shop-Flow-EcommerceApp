import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Unable to load content. Please check your connection and try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-[16px] bg-[#FEF2F2] flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-[#EF4444]" strokeWidth={1.5} />
      </div>
      <h3 className="text-[#0F172A] text-h4 mb-2">{title}</h3>
      <p className="text-[#64748B] text-body-sm max-w-sm">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-[#E2E8F0] text-[#0F172A] text-sm font-600 rounded-[10px] hover:bg-[#F8FAFC] transition-colors duration-150"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
