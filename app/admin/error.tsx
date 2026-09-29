"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
        <AlertOctagon className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-1">Admin Panel Error</h2>
      <p className="text-xs text-slate-600 max-w-sm mb-6">
        An error occurred while rendering the admin management portal.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Retry Action
        </button>

        <Link
          href="/admin/dashboard"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
