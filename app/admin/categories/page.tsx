"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Trash2 } from "lucide-react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/lib/hooks/use-categories";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/shared/Spinner";
import { faker } from "@/lib/data/faker-seed";

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories = [], isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createCategoryMutation.mutateAsync({
        name,
        slug: faker.helpers.slugify(name.toLowerCase()),
        description,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
        status: "active",
      });
      toast.success("Category created successfully");
      setIsModalOpen(false);
      setName("");
      setDescription("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    }
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategoryMutation.mutate(id, {
        onSuccess: () => toast.success("Category deleted"),
        onError: (err: any) => toast.error(err.message || "Failed to delete"),
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#0F172A]">Categories</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Manage store product categories</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-600 rounded-[10px] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="card-base p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-12 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <div key={cat.id} className="card-base overflow-hidden flex flex-col justify-between p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-[12px] bg-[#F8FAFC] overflow-hidden shrink-0 border border-[#E2E8F0] relative">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-700 text-base text-[#0F172A]">{cat.name}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mt-1">{cat.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-600 text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-1 rounded-full">
                  {cat.productCount} Products
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-[6px] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 space-y-4">
            <h2 className="text-h3 text-[#0F172A]">Add New Category</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-600 text-[#475569] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Gaming Consoles"
                  className="w-full h-11 px-4 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-sm font-600 text-[#475569] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description..."
                  className="w-full p-3 border border-[#CBD5E1] rounded-[10px] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E2E8F0] text-sm font-600 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="px-5 py-2 bg-[#7C3AED] text-white text-sm font-600 rounded-[10px]"
                >
                  {createCategoryMutation.isPending ? "Creating..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
