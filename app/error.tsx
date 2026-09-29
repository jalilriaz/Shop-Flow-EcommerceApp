"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error("Storefront Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center page-container">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 shadow-xs">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h1>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>

        <Link
          href="/"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
