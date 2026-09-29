"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProduct, useRelatedProducts } from "@/lib/hooks/use-products";
import { useReviewsByProduct } from "@/lib/hooks/use-reviews";
import { Rating } from "@/components/shared/Rating";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeleton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/Spinner";
import { RatingBreakdown } from "@/components/product/RatingBreakdown";
import { ReviewFormModal } from "@/components/product/ReviewFormModal";
import { ProductJsonLd } from "@/components/shared/ProductJsonLd";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: reviews = [] } = useReviewsByProduct(product?.id ?? "");
  const { data: related = [] } = useRelatedProducts(
    product?.id ?? "",
    product?.categorySlug ?? ""
  );

  const { addItem, isInCart } = useCart();
  const { addItem: wishlistAdd, removeItem: wishlistRemove, isWishlisted } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [added, setAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="page-container py-20 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="page-container py-20 text-center">
        <h1 className="text-h2 text-[#0F172A] mb-2">Product Not Found</h1>
        <p className="text-[#64748B] mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="px-6 py-3 bg-[#7C3AED] text-white font-600 rounded-[10px]">
          Back to Products
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  function handleAddToCart() {
    if (outOfStock) return;
    addItem({
      productId: product!.id,
      name: product!.name,
      image: product!.images[0],
      price: product!.price,
      discountPrice: product!.discountPrice,
      quantity,
      stock: product!.stock,
    });
    setAdded(true);
    toast.success("Added to cart", { description: `${quantity}× ${product!.name}` });
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWishlist() {
    if (wishlisted) {
      wishlistRemove(product!.id);
      toast.info("Removed from wishlist");
    } else {
      wishlistAdd(product!);
      toast.success("Saved to wishlist");
    }
  }

  const stockLabel: "in-stock" | "low-stock" | "out-of-stock" = outOfStock
    ? "out-of-stock"
    : lowStock
    ? "low-stock"
    : "in-stock";

  return (
    <div className="page-container py-8">
      {/* Product JSON-LD for SEO */}
      <ProductJsonLd product={product} />

      {/* Review Submission Modal */}
      <ReviewFormModal
        productName={product.name}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-[#64748B] mb-8 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[#7C3AED] transition-colors">Home</Link>
        <span className="text-[#CBD5E1]">/</span>
        <Link href="/products" className="hover:text-[#7C3AED] transition-colors">Products</Link>
        <span className="text-[#CBD5E1]">/</span>
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-[#7C3AED] transition-colors">{product.category}</Link>
        <span className="text-[#CBD5E1]">/</span>
        <span className="text-[#0F172A] truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-[16px] bg-[#F8FAFC] overflow-hidden border border-[#E2E8F0]">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                  disabled={selectedImage === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-sm border border-[#E2E8F0] flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))}
                  disabled={selectedImage === product.images.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-sm border border-[#E2E8F0] flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-16 h-16 rounded-[10px] border-2 bg-[#F8FAFC] overflow-hidden transition-all",
                    i === selectedImage ? "border-[#7C3AED]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                  )}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} width={64} height={64} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <p className="text-xs font-600 text-[#7C3AED] uppercase tracking-wide">{product.category}</p>
            <StatusBadge variant={stockLabel} />
          </div>

          <h1 className="text-h1 text-[#0F172A] mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
            <span className="text-xs text-[#64748B]">SKU: {product.sku}</span>
          </div>

          <PriceDisplay
            price={product.price}
            discountPrice={product.discountPrice}
            size="lg"
            className="mb-6"
          />

          <p className="text-[#475569] text-body leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="text-sm font-600 text-[#0F172A]">Quantity</p>
              <QuantitySelector
                value={quantity}
                min={1}
                max={product.stock}
                onChange={setQuantity}
                disabled={outOfStock}
              />
              {lowStock && (
                <span className="text-xs text-[#B45309] font-500">Only {product.stock} left</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-600 text-sm transition-all duration-150",
                  outOfStock
                    ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
                    : added
                    ? "bg-[#16A34A] text-white"
                    : "bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:scale-[0.98]"
                )}
              >
                {added ? (
                  <><Check className="w-4 h-4" /> Added to Cart</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> {inCart ? "Add More" : "Add to Cart"}</>
                )}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className={cn(
                  "w-12 h-12 min-w-[44px] rounded-[10px] border-2 flex items-center justify-center transition-all",
                  wishlisted
                    ? "border-[#EF4444] bg-[#FEF2F2]"
                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                )}
              >
                <Heart className={cn("w-5 h-5", wishlisted ? "fill-[#EF4444] stroke-[#EF4444]" : "stroke-[#94A3B8]")} />
              </button>
            </div>

            {!outOfStock && (
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="block w-full text-center py-3 border-2 border-[#7C3AED] text-[#7C3AED] font-600 text-sm rounded-[10px] hover:bg-[#F5F3FF] transition-colors"
              >
                Buy Now
              </Link>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] space-y-3">
            {[
              { icon: Truck, text: "Free shipping on orders over $100" },
              { icon: RotateCcw, text: "30-day hassle-free returns" },
              { icon: Shield, text: "Secure checkout, 100% protected" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-[#475569]">
                <item.icon className="w-4 h-4 text-[#22C55E] shrink-0" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-[#E2E8F0] mb-8">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 text-sm font-600 border-b-2 transition-colors capitalize",
                activeTab === tab
                  ? "border-[#7C3AED] text-[#7C3AED]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              )}
            >
              {tab === "reviews" ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="max-w-2xl">
            <p className="text-[#475569] text-body leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-2xl">
            <div className="card-base overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], i) => (
                <div
                  key={key}
                  className={cn(
                    "grid grid-cols-2 px-5 py-3.5",
                    i % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white",
                    i < Object.keys(product.specifications).length - 1 && "border-b border-[#E2E8F0]"
                  )}
                >
                  <span className="text-sm font-600 text-[#475569]">{key}</span>
                  <span className="text-sm text-[#0F172A]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-3xl space-y-6">
            <RatingBreakdown
              ratingAvg={product.rating}
              reviewCount={product.reviewCount}
              onWriteReviewClick={() => setIsReviewModalOpen(true)}
            />

            {reviews.length === 0 ? (
              <p className="text-[#64748B] text-body">No reviews yet. Be the first to review this product.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="card-base p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-600 text-[#0F172A]">{review.customerName}</p>
                      <Rating value={review.rating} size="sm" showCount={false} className="mt-1" />
                    </div>
                    <p className="text-xs text-[#94A3B8]">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-600 text-[#0F172A] mb-1">{review.title}</p>
                  <p className="text-sm text-[#475569] leading-relaxed">{review.body}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-h2 text-[#0F172A] mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
