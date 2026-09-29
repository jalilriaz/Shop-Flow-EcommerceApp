import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-[16px] bg-[#F5F3FF] flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 text-[#7C3AED]" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-[#0F172A] text-h4 mb-2">{title}</h3>
      {description && (
        <p className="text-[#64748B] text-body-sm max-w-sm">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-600 rounded-[10px] transition-colors duration-150"
            >
              {action.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-600 rounded-[10px] transition-colors duration-150"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
