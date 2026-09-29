"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormData } from "@/lib/validations/product.schema";
import { useCategories } from "@/lib/hooks/use-categories";
import { useCreateProduct } from "@/lib/hooks/use-products";
import { toast } from "sonner";
import { faker } from "@/lib/data/faker-seed";

export default function CreateProductPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createProductMutation = useCreateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "active",
      featured: false,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
      tags: ["featured", "new"],
    },
  });

  async function onSubmit(data: ProductFormData) {
    try {
      const selectedCategory = categories.find((c) => c.slug === data.categorySlug);
      await createProductMutation.mutateAsync({
        name: data.name,
        description: data.description,
        category: selectedCategory?.name ?? "Electronics",
        categorySlug: data.categorySlug,
        brand: data.brand,
        price: Number(data.price),
        discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
        sku: data.sku,
        stock: Number(data.stock),
        images: Array.isArray(data.images) ? data.images : [data.images],
        featured: Boolean(data.featured),
        status: data.status as any,
        specifications: { Warranty: "1 Year", Origin: "Imported" },
        tags: typeof data.tags === "string" ? data.tags.split(",").map((t) => t.trim()) : (data.tags ?? ["featured"]),
      });

      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    }
  }

  function handleNameChange(name: string) {
    setValue("name", name);
    const slug = faker.helpers.slugify(name.toLowerCase());
    setValue("categorySlug", slug);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-[8px] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-h2 text-[#0F172A]">Create Product</h1>
          <p className="text-sm text-[#64748B]">Add a new item to your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-base p-6 space-y-4">
          <h2 className="text-base font-700 text-[#0F172A] border-b border-[#E2E8F0] pb-3">
            Basic Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Product Name *</label>
              <input
                type="text"
                {...register("name")}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Wireless Noise-Canceling Headphones"
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none ${
                  errors.name ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.name && <p className="text-xs text-[#EF4444] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Brand *</label>
              <input
                type="text"
                {...register("brand")}
                placeholder="e.g., Sony"
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none ${
                  errors.brand ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.brand && <p className="text-xs text-[#EF4444] mt-1">{errors.brand.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Category *</label>
              <select
                {...register("categorySlug")}
                className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] bg-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categorySlug && <p className="text-xs text-[#EF4444] mt-1">{errors.categorySlug.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Description *</label>
              <textarea
                rows={4}
                {...register("description")}
                placeholder="Describe product key features, materials, and benefits..."
                className={`w-full p-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none ${
                  errors.description ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.description && <p className="text-xs text-[#EF4444] mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card-base p-6 space-y-4">
          <h2 className="text-base font-700 text-[#0F172A] border-b border-[#E2E8F0] pb-3">
            Pricing & Inventory
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Base Price ($) *</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="299.99"
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none ${
                  errors.price ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.price && <p className="text-xs text-[#EF4444] mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("discountPrice", { valueAsNumber: true })}
                placeholder="249.99 (Optional)"
                className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">Stock Quantity *</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="45"
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none ${
                  errors.stock ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.stock && <p className="text-xs text-[#EF4444] mt-1">{errors.stock.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-600 text-[#475569] mb-1.5">SKU *</label>
              <input
                type="text"
                {...register("sku")}
                placeholder="SNY-WH1000"
                className={`w-full h-11 px-4 border rounded-[10px] text-sm text-[#0F172A] focus:outline-none ${
                  errors.sku ? "border-[#EF4444]" : "border-[#CBD5E1] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.sku && <p className="text-xs text-[#EF4444] mt-1">{errors.sku.message}</p>}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-[#E2E8F0] rounded-[10px] text-sm font-600 text-[#475569] hover:bg-[#F8FAFC]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || createProductMutation.isPending}
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-600 rounded-[10px] text-sm transition-colors"
          >
            {createProductMutation.isPending ? "Creating..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
