"use client";

import { use } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCategory } from "@/lib/hooks/use-categories";
import { useProducts } from "@/lib/hooks/use-products";
import { ShoppingBag } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: category, isLoading: catLoading } = useCategory(slug);
  const { data: products = [], isLoading: prodLoading } = useProducts({
    category: slug,
  });

  if (catLoading) {
    return (
      <div className="page-container py-20 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="text-h2 text-[#0F172A] mb-2">Category Not Found</h1>
        <p className="text-[#64748B] mb-6">The category you are looking for does not exist.</p>
        <Link href="/products" className="px-6 py-3 bg-[#7C3AED] text-white font-600 rounded-[10px]">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#64748B] mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#7C3AED] transition-colors">
          Home
        </Link>
        <span className="mx-2 text-[#CBD5E1]">/</span>
        <Link href="/products" className="hover:text-[#7C3AED] transition-colors">
          Categories
        </Link>
        <span className="mx-2 text-[#CBD5E1]">/</span>
        <span className="text-[#0F172A]">{category.name}</span>
      </nav>

      {/* Category Hero */}
      <div className="card-base p-8 mb-10 bg-gradient-to-r from-[#F5F3FF] to-white border-brand-200">
        <h1 className="text-h1 text-[#0F172A] mb-2">{category.name}</h1>
        <p className="text-[#64748B] text-body max-w-xl mb-4">{category.description}</p>
        <span className="inline-flex items-center px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-600 text-[#7C3AED]">
          {products.length} Products Available
        </span>
      </div>

      {/* Product grid */}
      {prodLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products in this category"
          description="Check back later for new arrivals."
          action={{ label: "View All Products", href: "/products" }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
