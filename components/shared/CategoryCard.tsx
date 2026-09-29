import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/types/category";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative block rounded-[16px] overflow-hidden aspect-[4/3]",
        "hover:shadow-lg transition-shadow duration-200",
        className
      )}
    >
      {/* Image */}
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-white font-700 text-base leading-tight">{category.name}</h3>
            <p className="text-white/70 text-xs mt-0.5">{category.productCount} products</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
