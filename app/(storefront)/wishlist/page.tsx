"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  function handleMoveAllToCart() {
    items.forEach((product) => {
      if (product.stock > 0) {
        addItem({
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          discountPrice: product.discountPrice,
          quantity: 1,
          stock: product.stock,
        });
      }
    });
    clearWishlist();
    toast.success("Moved all items to cart");
  }

  if (items.length === 0) {
    return (
      <div className="page-container py-16">
        <h1 className="text-h1 text-[#0F172A] mb-8">My Wishlist</h1>
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love and find them here later."
          action={{ label: "Discover Products", href: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h1 text-[#0F172A]">My Wishlist</h1>
          <p className="text-[#64748B] text-body-sm mt-1">{items.length} saved products</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearWishlist}
            className="flex items-center gap-1.5 px-4 h-10 border border-[#E2E8F0] rounded-[10px] text-sm font-500 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#EF4444] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
          <button
            type="button"
            onClick={handleMoveAllToCart}
            className="flex items-center gap-2 px-5 h-10 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-[10px] text-sm font-600 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Move All to Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
