"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { ProductCardSkeleton, CategoryCardSkeleton } from "@/components/shared/Skeleton";
import { useCategories } from "@/lib/hooks/use-categories";
import { useFeaturedProducts } from "@/lib/hooks/use-products";

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts(4);

  const displayCategories = categories?.slice(0, 6) ?? [];
  const displayFeatured = featured ?? [];

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F3FF] via-white to-[#EDE9FE]">
        <div className="page-container py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EDE9FE] border border-[#DDD6FE] rounded-full mb-6">
                <Zap className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="text-xs font-600 text-[#7C3AED]">New arrivals every week</span>
              </div>
              <h1 className="text-display text-[#0F172A] mb-6">
                Discover products<br />
                <span className="text-[#7C3AED]">you&apos;ll love.</span>
              </h1>
              <p className="text-body-lg text-[#475569] mb-8 max-w-lg">
                Curated essentials. Simple shopping experience. From electronics to fashion — everything you need, thoughtfully selected.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-600 rounded-[10px] transition-colors duration-150 text-sm"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-600 rounded-[10px] transition-colors duration-150 text-sm"
                >
                  Explore Categories
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Shield className="w-4 h-4 text-[#22C55E]" />
                  Secure payments
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Truck className="w-4 h-4 text-[#22C55E]" />
                  Free shipping over $100
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Zap className="w-4 h-4 text-[#22C55E]" />
                  Easy returns
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#DDD6FE] to-[#EDE9FE] opacity-40" />
                <div className="absolute inset-6 rounded-[24px] overflow-hidden bg-white shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                    alt="Premium headphones"
                    fill
                    className="object-contain p-8"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-[12px] shadow-md border border-[#E2E8F0] p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#F5F3FF] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-xs font-600 text-[#0F172A]">Trusted Quality</p>
                    <p className="text-[10px] text-[#64748B]">100% authentic products</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-[12px] shadow-md border border-[#E2E8F0] p-3">
                  <p className="text-xs font-700 text-[#0F172A]">⭐ 4.9/5</p>
                  <p className="text-[10px] text-[#64748B]">2k+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="page-container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-h2 text-[#0F172A] mb-1">Shop by Category</h2>
            <p className="text-[#64748B] text-body-sm">Find what you need in our curated categories</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-600 text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)
            : displayCategories.map((cat) => (
                <div key={cat.id}>
                  <CategoryCard category={cat} />
                </div>
              ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-[#F8FAFC] py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-h2 text-[#0F172A] mb-1">Featured Products</h2>
              <p className="text-[#64748B] text-body-sm">Our most loved, carefully curated picks</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-600 text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : displayFeatured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* ── Promo section ── */}
      <section className="page-container py-16">
        <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] p-8 md:p-12">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-600 text-white">Limited Time Offer</span>
              </div>
              <h2 className="text-h2 text-white mb-2">Get 20% off your first order</h2>
              <p className="text-white/80 text-body max-w-md">
                Sign up and enjoy exclusive deals, early access to new products, and members-only discounts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#7C3AED] font-600 rounded-[10px] hover:bg-[#F5F3FF] transition-colors text-sm"
              >
                Create Account
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 border border-white/30 text-white font-600 rounded-[10px] hover:bg-white/20 transition-colors text-sm"
              >
                Browse Deals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
