"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/lib/hooks/use-products";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/Spinner";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading } = useProducts({ search: search || undefined });
  const deleteProductMutation = useDeleteProduct();

  function handleDelete(id: string, name: string) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => toast.success("Product deleted successfully"),
        onError: (err: any) => toast.error(err.message || "Failed to delete product"),
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#0F172A]">Products</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Manage product catalog, pricing, and stock</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-600 rounded-[10px] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="card-base p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="search"
            placeholder="Search by product name, SKU, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="card-base overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-600 text-[#475569] uppercase tracking-wide">
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[8px] bg-[#F8FAFC] overflow-hidden shrink-0 border border-[#E2E8F0]">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-600 text-[#0F172A] line-clamp-1">{product.name}</p>
                        <p className="text-xs text-[#94A3B8]">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#475569]">{product.category}</td>
                  <td className="px-5 py-3.5 text-sm font-700 text-[#0F172A]">
                    {formatPrice(product.discountPrice ?? product.price)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#475569]">{product.stock} pcs</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      variant={product.stock === 0 ? "out-of-stock" : product.stock <= 5 ? "low-stock" : "active"}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="p-2 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#F5F3FF] rounded-[8px] transition-colors"
                        title="View on Storefront"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#F5F3FF] rounded-[8px] transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-[8px] transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
