"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/types/product";
import { Rating } from "./Rating";
import { PriceDisplay } from "./PriceDisplay";
import { StatusBadge } from "./StatusBadge";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "wishlist";
  className?: string;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  variant = "default",
  className,
  showQuickView = true,
  onQuickView,
}: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { addItem: wishlistAdd, removeItem: wishlistRemove, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
      stock: product.stock,
    });
    toast.success("Added to cart", {
      description: product.name,
    });
  }

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (wishlisted) {
      wishlistRemove(product.id);
      toast.info("Removed from wishlist");
    } else {
      wishlistAdd(product);
      toast.success("Saved to wishlist", { description: product.name });
    }
  }

  function handleQuickViewClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "flex gap-4 p-4 card-base hover:shadow-md transition-shadow duration-200 group",
          className
        )}
      >
        <div className="w-20 h-20 rounded-[10px] bg-[#F8FAFC] overflow-hidden shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={80}
            height={80}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#64748B] mb-0.5">{product.category}</p>
          <p className="text-sm font-600 text-[#0F172A] line-clamp-2 leading-snug">{product.name}</p>
          <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" showBadge={false} className="mt-1" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block card-base overflow-hidden hover:shadow-md transition-all duration-200 relative",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F8FAFC] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-200"
        />

        {/* Quick View trigger hover overlay */}
        {showQuickView && onQuickView && (
          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="pointer-events-auto bg-white/90 hover:bg-white text-slate-800 font-medium text-xs px-3.5 py-2 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-800" /> Quick View
            </button>
          </div>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10",
            "bg-white shadow-sm border border-[#E2E8F0] transition-all duration-150",
            "hover:scale-110 hover:border-[#7C3AED]",
            wishlisted && "bg-[#FEF2F2] border-[#EF4444]"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              wishlisted ? "fill-[#EF4444] stroke-[#EF4444]" : "stroke-[#94A3B8]"
            )}
          />
        </button>

        {/* Stock badge */}
        {outOfStock && (
          <div className="absolute bottom-3 left-3 z-10">
            <StatusBadge variant="out-of-stock" />
          </div>
        )}
        {lowStock && !outOfStock && (
          <div className="absolute bottom-3 left-3 z-10">
            <StatusBadge variant="low-stock" label={`Only ${product.stock} left`} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 space-y-2">
        <p className="text-xs font-500 text-[#7C3AED] uppercase tracking-wide">{product.category}</p>
        <h3 className="text-sm font-600 text-[#0F172A] line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <Rating value={product.rating} count={product.reviewCount} size="sm" />
        <div className="flex items-center justify-between pt-1 gap-2">
          <PriceDisplay
            price={product.price}
            discountPrice={product.discountPrice}
            size="sm"
          />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-600 transition-all duration-150 shrink-0",
              outOfStock
                ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
                : inCart
                ? "bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]"
                : "bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:scale-95"
            )}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {inCart ? "In Cart" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
