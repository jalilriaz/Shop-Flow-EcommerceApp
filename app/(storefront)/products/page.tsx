"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useProducts } from "@/lib/hooks/use-products";
import { useCategories } from "@/lib/hooks/use-categories";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $300", min: 100, max: 300 },
  { label: "$300+", min: 300, max: Infinity },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState<any>("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const priceRange = PRICE_RANGES[selectedPriceRange];

  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts({
    search: search || undefined,
    category: selectedCategory,
    sort: selectedSort,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  const filtered = products ?? [];

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-600 text-[#0F172A] mb-3">Category</h3>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-[8px] transition-colors",
              selectedCategory === "all"
                ? "bg-[#F5F3FF] text-[#7C3AED] font-600"
                : "text-[#475569] hover:bg-[#F8FAFC]"
            )}
          >
            All Products
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-[8px] transition-colors flex items-center justify-between",
                selectedCategory === cat.slug
                  ? "bg-[#F5F3FF] text-[#7C3AED] font-600"
                  : "text-[#475569] hover:bg-[#F8FAFC]"
              )}
            >
              {cat.name}
              <span className="text-xs text-[#94A3B8]">{cat.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-600 text-[#0F172A] mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedPriceRange(i)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-[8px] transition-colors",
                selectedPriceRange === i
                  ? "bg-[#F5F3FF] text-[#7C3AED] font-600"
                  : "text-[#475569] hover:bg-[#F8FAFC]"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#64748B] mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#7C3AED] transition-colors">Home</Link>
        <span className="mx-2 text-[#CBD5E1]">/</span>
        <span className="text-[#0F172A]">Products</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-[#0F172A]">All Products</h1>
          <p className="text-[#64748B] text-body-sm mt-1">{filtered.length} products</p>
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-10 w-48 sm:w-64 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#8B5CF6] transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="appearance-none pl-3 pr-8 h-10 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] bg-white focus:outline-none focus:border-[#8B5CF6] cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 h-10 border border-[#E2E8F0] rounded-[10px] text-sm text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="card-base p-5 sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try changing your filters or search terms."
              action={{ label: "Clear Filters", onClick: () => { setSearch(""); setSelectedCategory("all"); setSelectedPriceRange(0); } }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] p-6 max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-700 text-[#0F172A]">Filters</h2>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full py-3 bg-[#7C3AED] text-white font-600 rounded-[10px] text-sm"
            >
              Apply Filters ({filtered.length} results)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
