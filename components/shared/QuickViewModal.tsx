"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Heart, Check, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types/product";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Rating } from "@/components/shared/Rating";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { VariantSelector } from "@/components/shared/VariantSelector";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem, isInCart } = useCart();
  const { isWishlisted, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !product) return null;

  const activeImage = selectedImage || product.images[0] || "/placeholder.jpg";
  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: activeImage,
      quantity,
      stock: product.stock,
    });
    toast.success(`Added ${product.name} (${selectedSize} / ${selectedColor}) to cart!`);
    onClose();
  };

  const handleToggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
      toast.info(`Removed ${product.name} from wishlist.`);
    } else {
      addToWishlist(product);
      toast.success(`Saved ${product.name} to wishlist!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Product Media Column */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.discountPrice && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "relative h-16 w-16 rounded-lg overflow-hidden border transition-all flex-shrink-0",
                      activeImage === img ? "border-emerald-600 ring-2 ring-emerald-600/30" : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                {product.brand} • {product.category}
              </span>
              <h2 id="quick-view-title" className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <Rating value={product.rating} count={product.reviewCount} />
              </div>

              {/* Price */}
              <div className="mt-3">
                <PriceDisplay
                  price={product.price}
                  discountPrice={product.discountPrice}
                  size="lg"
                />
              </div>

              <p className="text-sm text-slate-600 line-clamp-3 mt-3">
                {product.description}
              </p>

              {/* Variants */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <VariantSelector
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  onSelectSize={setSelectedSize}
                  onSelectColor={setSelectedColor}
                />
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Quantity:</span>
                <QuantitySelector
                  value={quantity}
                  max={product.stock}
                  onChange={setQuantity}
                />
                <span className="text-xs text-slate-500">
                  ({product.stock} items in stock)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {inCart ? "Add More to Cart" : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label="Wishlist"
                  className={cn(
                    "p-3 rounded-xl border transition-colors flex items-center justify-center",
                    wishlisted
                      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Heart className={cn("w-5 h-5", wishlisted && "fill-current")} />
                </button>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full text-center text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 py-1.5 transition-colors"
              >
                View Full Product Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
